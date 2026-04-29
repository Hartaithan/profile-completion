import { ref } from "vue";

interface Params {
  message?: string;
}

export type AbortHandler = (section: string) => void;

const defaultMessage = "Request was canceled by the user";

export const useAbortController = (params?: Params) => {
  const message = params?.message ?? defaultMessage;

  const controller = ref<AbortController | null>(null);

  const abort: AbortHandler = (section) => {
    if (!controller.value) return;
    controller.value.abort(message);
    console.info(`${section}-cancelled`);
  };

  const getSignal = () => {
    if (controller.value) controller.value.abort();
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
