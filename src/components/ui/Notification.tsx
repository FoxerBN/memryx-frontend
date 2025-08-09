import type { NotificationProps } from "@/interface/notification";

const Notification = ({ type, message }: NotificationProps) => {
  if (type === "loading") {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }
  if (type === "error") {
    return (
      <div className="text-center text-lg text-error py-8">
        {message ?? "An error occurred."}
      </div>
    );
  }
  return (
    <div className="text-center text-lg py-8">
      {message}
    </div>
  );
};

export default Notification;
