import { ref } from "vue";

const isSidebarCollapsed = ref(false);

export const useSidebar = () => {
  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  };

  const collapseSidebar = () => {
    isSidebarCollapsed.value = true;
  };

  const expandSidebar = () => {
    isSidebarCollapsed.value = false;
  };

  return {
    isSidebarCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  };
};
