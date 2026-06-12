import React, { useState } from 'react'
import ResumeManager from './Resume'
import ResumeGallery from './GalleryManagement'
function AboutPage() {
  const [activePanel, setActivePanel] = useState(null) 
  return (
    <div className="h-full flex flex-col">
      {activePanel ? (
        <div className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-5 rounded-full bg-[--edu-primary]" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
              {activePanel === 'resume' ? 'Resume & CV Manager' : 'Gallery'}
            </span>
          </div>
          <button
            onClick={() => setActivePanel(null)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-red-400 hover:text-red-500 px-3.5 py-1.5 rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>
      ) : (
        <div className="shrink-0 px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <div className="w-[3px] h-5 rounded-full bg-[--edu-primary]" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">About Page</span>
        </div>
      )}
      {!activePanel && (
        <div className="flex-1 flex items-start justify-start p-6 gap-3">
          <button
            onClick={() => setActivePanel('resume')}
            className="cursor-pointer edu-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
            Resume & CV Manager
          </button>

          <button
            onClick={() => setActivePanel('gallery')}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[--edu-primary] hover:text-[--edu-primary] rounded-xl transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Gallery
          </button>
        </div>
      )}
      {activePanel === 'resume' && (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <ResumeManager />
        </div>
      )}

      {activePanel === 'gallery' && (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <ResumeGallery />
        </div>
      )}

    </div>
  )
}

export default AboutPage