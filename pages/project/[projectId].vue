<script lang="ts" setup>
import type { InfoMemberProjectDto, ProjectDetailDto } from "~/types";

const app = useAppStore();
const route = useRoute();
const privateApi = usePrivateApi();
const apiPath = useApiPath();
const notif = useNotification();
const routeParam = useRoute().params as { projectId: number };
const socket = useSocketClient();

let intervalId: number | null = null;

const project = ref<{
  project?: ProjectDetailDto;
  loading: boolean;
}>({
  loading: true,
});

const message = ref("");
const offlineMembers = ref<InfoMemberProjectDto[]>([]);
const onlineMembers = ref<number[]>([]);
onMounted(() => {
  app.headerTitle = "Project";
  app.emojiKey = "🏠";
  initProjectPage();
});

const initProjectPage = async () => {
  project.value.loading = true;
  try {
    let data = await privateApi.get(
      apiPath.projectDetails(routeParam.projectId)
    );
    project.value.project = data.data as ProjectDetailDto;
  } catch (err: any) {
    console.log(err);

    if (err.response.status === 404) {
      notif.error({
        message: "Project not found",
      });
    }
  } finally {
    project.value.loading = false;
  }
  const conn = await socket.getConnection();
  conn.emit(
    "onProjectJoin",
    JSON.stringify({ projectId: parseInt(`${routeParam.projectId}`) })
  );

  conn.emit(
    "getOnlineProjectMember",
    JSON.stringify({ projectId: parseInt(`${routeParam.projectId}`) })
  );

  intervalId = window.setInterval(() => {
    conn.emit(
      "getOnlineProjectMember",
      JSON.stringify({ projectId: parseInt(`${routeParam.projectId}`) })
    );
  }, 5000); // Multiply by 1000 to convert seconds to milliseconds

  conn.on("onlineProjectMember", (val) => {
    onlineMembers.value = val.onlineMembers;
  });

  conn.on("projectMember", (val) => {
    let old = project.value.project;
    if (old) {
      old.members = val.members;
      project.value.project = old;
    }
  });
  conn.on("projectSubProject", (val) => {
    let old = project.value.project;
    if (old) {
      old.subProjects = val.subProjects;
      project.value.project = old;
    }
  });
  conn.on("projectReport", (val) => {
    let old = project.value.project;
    if (old) {
      old.reports = val.reports;
      project.value.project = old;
    }
  });
  conn.on("projectAttachment", (val) => {
    let old = project.value.project;
    if (old) {
      old.attachments = val.attachments;
      project.value.project = old;
    }
  });

  console.log(conn);
};

const onLeave = async () => {
  const conn = await socket.getConnection();
  conn.emit(
    "onProjectLeave",
    JSON.stringify({ projectId: parseInt(`${routeParam.projectId}`) })
  );

  conn.off("projectMember");
  conn.off("projectSubProject");
  conn.off("onlineProjectMember");
  conn.off("projectReport");
  conn.off("projectAttachment");
  if (intervalId) {
    clearInterval(intervalId);
  }
};

onBeforeRouteLeave(async () => {
  await onLeave();
});

onBeforeRouteUpdate(async () => {
  await onLeave();
});
</script>

<template>
  <UModal>
    <p>Ayam</p>
  </UModal>
  <div v-if="project.loading">Loading</div>
  <div v-else-if="project.project" class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">
      <p>{{ message }}</p>
      <h1 class="text-xl font-bold">{{ project.project.name }}</h1>
      <div class="flex gap-2">
        <h2 class="font-semibold">
          {{ new Date(project.project.startDate).toLocaleString() }}
        </h2>
        <div>Until</div>
        <h2 class="font-semibold">
          {{ new Date(project.project.endDate).toLocaleString() }}
        </h2>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <h1 class="font-bold text-lg">SubProjects</h1>
      <div class="subprojects">
        <NuxtLink
          :to="`/subproject/${project.project.id}/${i.id}`"
          v-for="i in project.project.subProjects"
          class="flex flex-col gap-5 border border-white p-2 rounded-sm"
        >
          <p>{{ i.name }}</p>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <h2>Members</h2>
      <div class="grid grid-cols-5 gap-2">
        <div
          v-for="i in project.project.members"
          class="flex flex-col items-center relative"
        >
          <NuxtImg
            v-if="i.profilePicture"
            :src="i.profilePicture"
            class="w-32 h-32 rounded-full object-cover"
          ></NuxtImg>
          <div v-else class="w-32 h-32 bg-zinc-700 rounded-full"></div>
          <p>{{ i.name }}</p>
          <p>{{ i.role }}</p>

          <div
            :class="
              onlineMembers.includes(i.userId) ? 'bg-green-500' : 'bg-red-500'
            "
            class="w-4 h-4 rounded-full absolute right-0"
          ></div>
        </div>
      </div>
      <div class="attachment">
        <h1>Attachment</h1>

        <div
          v-if="
            project.project.attachments &&
            project.project.attachments.length != 0
          "
        >
          <p v-for="i in project.project.attachments">
            {{ i.name }}
          </p>
        </div>
        <div v-else>Tidak Ada Attachment</div>
      </div>
      <div class="report">
        <h1>Report</h1>
        <div
          v-if="project.project.reports && project.project.reports.length != 0"
        >
          <p v-for="i in project.project.reports">
            {{ i.name }}
          </p>
        </div>
        <div v-else>Tidak Ada Reports</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
