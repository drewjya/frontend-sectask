export const useApiPath = () => {
  const baseUrl = useRuntimeConfig().public.API_BASE_URL;
  return {
    authLogin: encodeURI(`/api/auth/login`),
    authRegister: encodeURI(`/api/auth/register`),
    authRefresh: encodeURI(`/api/auth/refresh`),
    authLogout: encodeURI(`/api/auth/logout`),

    userFetch: (userId: number) => encodeURI(`/api/user/${userId}`),
    userEdit: encodeURI(`/api/user`),
    userDeleteProfilePicture: encodeURI("/api/user/picture"),

    projectNew: encodeURI(`/api/project/new`),
    projectActive: encodeURI(`/api/project/active`),
    projectRecentUpdates: encodeURI(`/api/project/recent_updates`),
    projectSearchMember: (projectId: number, email: string) =>
      encodeURI(`/api/project/${projectId}/members?email=${email}`),
    projectAddMember: (projectId: number) =>
      encodeURI(`/api/project/${projectId}/members`),
    projectArchive: (projectId: number) =>
      encodeURI(`/api/project/${projectId}/archive`),
    projectDetails: (projectId: number) =>
      encodeURI(`/api/project/${projectId}`),

    subprojectNew: encodeURI(`/api/subproject/new`),
    subprojectDetails: (subProjectId: number) =>
      encodeURI(`/api/subproject/${subProjectId}`),
    subprojectSearchMember: (subprojectId: number, email: string) =>
      encodeURI(`/api/subproject/${subprojectId}/members?email=${email}`),
    subprojectAddMember: (subprojectId: number) =>
      encodeURI(`/api/subproject/${subprojectId}/members`),

    findingNew: encodeURI(`/api/finding/new`),
  };
};
