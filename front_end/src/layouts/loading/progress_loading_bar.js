import React,{useState,useLayoutEffect} from 'react'

export default function ProgressLoadingBar({element}) {
  const [progress, set_progress] = useState(0)

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      set_progress((prev) => {
        if (prev === 100) {
          clearInterval(interval)
          return -1
        }
        return prev + 10
      })
    }, 100)
    return () => clearInterval(interval)
  }, [set_progress])


  return (
    <>
      {progress > -1 ? (
        <tr className="bg-gray-100 dark:bg-slate-600 border-b transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800">
          <td colSpan="5" className="td_tbody !text-center">
            <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
              <div className="bg-light-green h-5" style={{ width: `${progress}%` }}>
                <div className="font-semibold text-sm text-white">{progress}%</div>
              </div>
            </div>
          </td>
        </tr>
      ) : (
        element
      )}
    </>
  );
}
