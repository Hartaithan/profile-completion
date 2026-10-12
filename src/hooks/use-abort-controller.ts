import { ref } from "vue";

export type AbortHandler = () => void;

export const useAbortController = () => {
  const controller = ref<AbortController | null>(null);

  const abort: AbortHandler = () => {
    if (!controller.value) return;
    controller.value.abort("user");
  };

  const getSignal = () => {
    if (controller.value) controller.value.abort("superseded");
    controller.value = new AbortController();
    return controller.value.signal;
  };

  const isAborted = () => {
    return controller.value?.signal.aborted ?? false;
  };

  return {
    controller,
    abort,
    getSignal,
    isAborted,
  };
};
