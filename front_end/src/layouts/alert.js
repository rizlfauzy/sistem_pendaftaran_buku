import React from "react";

export default function Alert({ color, strong_text, children }) {
  return (
    <div className="for_alert">
      <div className={`alert bg-${color}-100 rounded-lg lg:py-5 py-2 lg:px-6 px-3 mb-3 lg:text-md text-xs text-${color}-700 inline-flex items-center w-full alert-dismissible fade show`} role="alert">
        <strong className="mr-1">{strong_text} </strong> {children}
        <button
          type="button"
          className={`btn-close box-content p-1 ml-auto text-${color}-900 border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-${color}-900 hover:opacity-75 hover:no-underline`}
          data-bs-dismiss="alert"
          aria-label="Close"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  );
}
