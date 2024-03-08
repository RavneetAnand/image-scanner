import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  type?: "success" | "warning";
}

const Toast = ({ message, duration = 5000, type = "success" }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) {
    return null;
  }

  const toastClass = `alert ${type === "success" ? "alert-success" : "alert-warning"}`;

  return (
    <div className="toast toast-top toast-center" style={{ transition: "opacity 0.5s", opacity: isVisible ? 1 : 0 }}>
      <div className={toastClass}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
