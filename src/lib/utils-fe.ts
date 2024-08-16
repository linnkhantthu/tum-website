import { FlashMessage } from "./models";
/**
 * Toast on Delete
 * @param toastId
 */
export const toastOnDelete = (
  toastId: string,
  toasts: FlashMessage[],
  setToasts: React.Dispatch<React.SetStateAction<FlashMessage[]>>
) => {
  const localToasts: FlashMessage[] | null = JSON.parse(
    localStorage.getItem("toasts")!
  );
  const filteredLocalToasts = localToasts?.filter(
    (toast) => toast.id !== toastId
  );

  localStorage.setItem(
    "toasts",
    JSON.stringify(filteredLocalToasts ? filteredLocalToasts : [])
  );

  const filteredToasts = toasts.filter((toast) => toast.id !== toastId);
  setToasts(filteredToasts);
  return true;
};

export function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function makeObservable(target: any) {
  let listeners: any = [];
  let value = target;

  function get() {
    return value;
  }

  function set(newValue: any) {
    if (value === newValue) return;
    value = newValue;
    // @ts-ignore
    listeners.forEach((l) => l(val));
  }

  function subscribe(listenerFunc: any) {
    listeners.push(listenerFunc);
    return () => unsubscribe(listenerFunc);
  }

  function unsubscribe(listenerFunc: any) {
    // @ts-ignore
    listeners = listeners.filter((l) => l !== listenerFunc);
  }

  return {
    get,
    set,
    subscribe,
  };
}
