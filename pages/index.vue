<script setup lang="ts">
import { HttpStatusCode } from "axios";

const app = useAppStore();
const route = useRoute();
const privateApi = usePrivateApi();
const apiPath = useApiPath();
const notif = useNotification();
const auth = useAuth();

app.headerTitle = undefined;
app.emojiKey = undefined;
const activeProject = ref<{
  data: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    projectPicture?: string;
  }[];
  loading: boolean;
}>({
  data: [],
  loading: true,
});

const recentUpdates = ref<{
  data: {
    id: number;
    documentId: number;
    type: string;
    title: string;
    description: string;
    updatedAt: string;
    projectPicture?: string;
  }[];
  loading: boolean;
}>({ data: [], loading: true });

if (route.query.refresh) {
  await navigateTo("/");
  location.reload();
}

onMounted(() => {
  app.headerTitle = "Home";
  app.emojiKey = "🏠";
  initRootPage();
});

const initRootPage = async () => {
  activeProject.value.loading = true;
  recentUpdates.value.loading = true;
  try {
    let responses = await Promise.all([
      privateApi.get(apiPath.projectActive),
      privateApi.get(apiPath.projectRecentUpdates),
    ]);

    // let projects = await privateApi.get(apiPath.projectActive);
    // let data = await sleep.for(1000, projects.data);
    activeProject.value.data = responses[0].data;
    recentUpdates.value.data = responses[1].data;
  } catch (e: any) {
    if (e.status) {
      const error = e.status as number;
      if (error === HttpStatusCode.Forbidden) {
        notif.warn({
          title: "Forbidden Access",
          message: "You aren't registered as page member",
        });
      }
    }
  } finally {
    activeProject.value.loading = false;
    recentUpdates.value.loading = false;
  }
};
</script>

<template>
  <div class="flex size-full flex-col justify-start gap-4 p-4">
    <div class="">
      <h1 class="text-3xl font-bold">Home</h1>
      <h2>
        Hello, and welcome back
        <span class="font-bold">{{ app.user?.name }}</span>
      </h2>
      <UButton label="Logout" @click="() => auth.logout()" />
    </div>
    <div>
      <h2>Active Project</h2>

      <div v-if="activeProject.loading" class="flex gap-5">
        <div v-for="i in 3" class="flex flex-col gap-5">
          <USkeleton class="h-20 w-44 rounded-lg bg-zinc-700" />
          <USkeleton class="h-5 w-44 rounded-lg bg-zinc-700" />
          <USkeleton class="h-5 w-44 rounded-lg bg-zinc-700" />
          <USkeleton class="h-5 w-44 rounded-lg bg-zinc-700" />
        </div>
      </div>
      <div v-else class="flex gap-5 overflow-auto">
        <NuxtLink
          v-for="i in activeProject.data"
          class="flex flex-col gap-5"
          :to="`/project/${i.id}`"
        >
          <NuxtImg
            v-if="i.projectPicture"
            :src="i.projectPicture"
            class="h-20 w-44 rounded-lg"
          ></NuxtImg>
          <div class="h-20 w-44 rounded-lg bg-zinc-700" v-else></div>
          <div class="h-5 w-44 rounded-lg bg-zinc-700">{{ i.name }}</div>
          <div class="h-5 w-44 rounded-lg bg-zinc-700">
            {{ new Date(i.startDate).toLocaleString() }}
          </div>
          <div class="h-5 w-44 rounded-lg bg-zinc-700">
            {{ new Date(i.endDate).toLocaleString() }}
          </div>
        </NuxtLink>
      </div>
    </div>

    <div>
      <h2>Recent Updates</h2>

      <div v-if="recentUpdates.loading" class="flex gap-5">
        <div v-for="i in 3" class="flex flex-col gap-5">
          <USkeleton class="h-20 w-44 rounded-lg bg-zinc-700" />
          <USkeleton class="h-5 w-44 rounded-lg bg-zinc-700" />
          <USkeleton class="h-5 w-44 rounded-lg bg-zinc-700" />
          <USkeleton class="h-5 w-44 rounded-lg bg-zinc-700" />
        </div>
      </div>
      <div v-else class="flex flex-col gap-5 overflow-auto">
        <div v-for="i in recentUpdates.data" class="flex gap-5">
          <NuxtImg
            v-if="i.projectPicture"
            :src="i.projectPicture"
            class="h-20 w-44 rounded-lg"
          ></NuxtImg>
          <div class="h-20 w-44 rounded-lg bg-zinc-700" v-else></div>
          <div class="flex flex-col gap-1">
            <div class="font-bold">{{ i.title }}</div>
            <div>{{ i.description }}</div>
            <div class="text-xs mt-3">
              {{ new Date(i.updatedAt).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
