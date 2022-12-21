import React from 'react'

export default function LoadingNavProfil() {
  return (
    <>
      <span className="text-base text-dark mr-4 flex py-2 group-hover:text-slate-800 dark:group-hover:text-primary dark:text-white nav-link bg-gray-300 rounded-lg ">
        <p className="bg-gray-400 w-24 h-3 rounded-full"></p>
      </span>
      <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" className="w-2 ml-2 dark:text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
      </svg>
    </>
  );
}
