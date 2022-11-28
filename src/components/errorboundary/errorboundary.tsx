import { useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import Style from "./errorboundary.module.css";

type ErrorMessage = {
  error: {
    message: string;
  };
  resetErrorBoundary: Function;
};

const ErrorBounary = ({
  error: { message },
  resetErrorBoundary,
}: ErrorMessage) => {
  const location = useLocation();
  const errorLocation = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname !== errorLocation.current) {
      resetErrorBoundary();
    }
  }, [location.pathname,resetErrorBoundary
  ]);

  return (
    <div className={Style.error_info}>
      <strong>OOPS!!! Something went wrong:</strong>
      <pre>{message}</pre>
    </div>
  );
};

export default ErrorBounary;
