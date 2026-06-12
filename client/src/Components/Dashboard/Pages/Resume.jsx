import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  updateLabel,
  clearMessages,
  selectResumeState,
  selectCVState,
} from '../../../redux-store/ResumeSlice.js'

const API = import.meta.env.VITE_API_BASE_URL;

const fmtSize = (bytes) => {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—'

const EXT_ICON = { pdf: '📄', doc: '📝', docx: '📝' }
const ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'


function DeleteModal({ doc, docType, onClose }) {
  const dispatch = useDispatch()
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleDelete = async () => {
    setDeleting(true)
    await dispatch(deleteDocument({ type: docType, id: doc._id }))
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 text-center mb-1">
          Delete this document?
        </h3>
        <p className="text-xs text-gray-400 text-center mb-4 leading-relaxed">
          This will permanently remove the file from Cloudinary and the database. This cannot be undone.
        </p>

        {/* File info pill */}
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 mb-5 border border-gray-100 dark:border-gray-700">
          <span className="text-base">{EXT_ICON[doc.format] || '📎'}</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
            {doc.label || doc.originalName || 'Untitled'}
          </span>
          <span className="ml-auto text-[11px] text-gray-400 shrink-0 uppercase">{doc.format}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
          >
            {deleting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Deleting…
              </>
            ) : 'Yes, delete'}
          </button>
        </div>

        <p className="text-[11px] text-red-400 text-center mt-3">
          Also deletes from Cloudinary storage
        </p>
      </div>
    </div>
  )
}

function UploadCard({ docType, state, onClear }) {
  const dispatch = useDispatch()
  const fileRef  = useRef(null)

  const [file,       setFile]       = useState(null)
  const [label,      setLabel]      = useState('')
  const [replaceOld, setReplaceOld] = useState(false)
  const [dragOver,   setDragOver]   = useState(false)

  const pickFile = (f) => {
    if (!f) return
    setFile(f)
    if (!label) setLabel(f.name.replace(/\.[^/.]+$/, ''))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    pickFile(e.dataTransfer.files[0])
  }

  const handleSubmit = () => {
    if (!file) return
    const fd = new FormData()
    fd.append(docType, file)
    fd.append('label', label.trim())
    if (replaceOld) fd.append('replaceOld', 'true')
    dispatch(uploadDocument({ type: docType, formData: fd }))
    setFile(null)
    setLabel('')
    setReplaceOld(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const isDoc = docType === 'resume'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="edu-accent-bar" />
        <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
          {isDoc ? 'Upload Resume' : 'Upload CV'}
        </h3>
      </div>

      <div
        className={`edu-upload-zone mb-4 flex flex-col items-center justify-center text-center min-h-[110px] transition-all
          ${dragOver ? 'border-[var(--edu-primary)] bg-[var(--edu-light)]' : ''}
          ${file ? 'border-[var(--edu-accent)] bg-[var(--edu-light)]' : 'bg-gray-50 dark:bg-gray-800'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => pickFile(e.target.files[0])}
        />
        {file ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">{EXT_ICON[file.name.split('.').pop()?.toLowerCase()] || '📎'}</span>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 break-all px-2">{file.name}</p>
            <p className="text-xs text-gray-400">{fmtSize(file.size)}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <span className="text-3xl text-gray-300">📂</span>
            <p className="text-sm text-gray-400">
              Click or drag a <span className="font-semibold text-gray-600 dark:text-gray-300">PDF / DOC / DOCX</span>
            </p>
            <p className="text-xs text-gray-300 mt-0.5">Max 10 MB</p>
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder={`Label – e.g. "Full-Stack ${isDoc ? 'Resume' : 'CV'} 2025"`}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        maxLength={120}
        className="edu-input w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 mb-3 focus:outline-none"
      />

      <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={replaceOld}
          onChange={(e) => setReplaceOld(e.target.checked)}
          className="accent-[var(--edu-primary)] w-3.5 h-3.5"
        />
        Delete all existing {isDoc ? 'resumes' : 'CVs'} on upload
      </label>

      {state.actionError && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2 mb-3">
          <span>⚠️ {state.actionError}</span>
          <button onClick={onClear} className="ml-2 font-bold text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {state.successMessage && (
        <div className="flex items-center justify-between bg-[var(--edu-light)] border border-[var(--edu-accent)] text-[var(--edu-primary)] text-xs rounded-lg px-3 py-2 mb-3">
          <span>✅ {state.successMessage}</span>
          <button onClick={onClear} className="ml-2 font-bold">✕</button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || state.uploading}
        className="edu-btn-primary w-full py-2.5 rounded-xl text-sm tracking-wide"
      >
        {state.uploading ? 'Uploading…' : `Upload ${isDoc ? 'Resume' : 'CV'}`}
      </button>
    </div>
  )
}

function DocumentRow({ doc, docType }) {
  const dispatch = useDispatch()
  const [editing,     setEditing]     = useState(false)
  const [newLabel,    setNewLabel]    = useState(doc.label || '')
  const [showConfirm, setShowConfirm] = useState(false)

  const saveLabel = () => {
    const trimmed = newLabel.trim()
    if (trimmed && trimmed !== doc.label) {
      dispatch(updateLabel({ type: docType, id: doc._id, label: trimmed }))
    }
    setEditing(false)
  }


  const handleView = () => {
    window.open(`${API}/${docType}/${doc._id}/view`, '_blank')
  }


  const handleDownload = () => {
    window.open(`${API}/${docType}/${doc._id}/download`, '_blank')
  }

  return (
    <>
      {showConfirm && (
        <DeleteModal
          doc={doc}
          docType={docType}
          onClose={() => setShowConfirm(false)}
        />
      )}

      <div className="flex items-start gap-3 p-4 rounded-xl border mb-3 bg-white dark:bg-gray-900 transition-all border-gray-100 dark:border-gray-700">
        <span className="text-2xl mt-0.5 shrink-0">
          {EXT_ICON[doc.format] || '📎'}
        </span>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2 items-center mb-1">
              <input
                autoFocus
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveLabel()
                  if (e.key === 'Escape') setEditing(false)
                }}
                className="edu-input flex-1 text-sm px-2 py-1 rounded-lg border border-[var(--edu-accent)] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none"
              />
              <button onClick={saveLabel} className="text-xs bg-[var(--edu-primary)] text-white px-2.5 py-1 rounded-lg font-semibold">✓</button>
              <button onClick={() => setEditing(false)} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">✕</button>
            </div>
          ) : (
            <p
              className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate cursor-default"
              onDoubleClick={() => setEditing(true)}
              title="Double-click to edit label"
            >
              {doc.label || doc.originalName || 'Untitled'}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-2 mt-1">
            <span className="text-[11px] text-gray-400 uppercase font-medium">{doc.format}</span>
            <span className="text-[11px] text-gray-300">·</span>
            <span className="text-[11px] text-gray-400">{fmtSize(doc.fileSize)}</span>
            <span className="text-[11px] text-gray-300">·</span>
            <span className="text-[11px] text-gray-400">{fmtDate(doc.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0 items-center flex-wrap">
          <button
            onClick={handleView}
            className="text-xs border border-[var(--edu-primary)] text-[var(--edu-primary)] px-2.5 py-1 rounded-lg font-semibold hover:bg-[var(--edu-light)] transition-colors"
          >
            View
          </button>
          <button
            onClick={handleDownload}
            className="text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Download
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}
function DocumentList({ docType }) {
  const dispatch = useDispatch()
  const state    = useSelector(docType === 'resume' ? selectResumeState : selectCVState)

  useEffect(() => {
    dispatch(fetchDocuments(docType))
  }, [dispatch, docType])

  if (state.loading) {
    return (
      <div className="space-y-3 mt-2">
        {[1, 2].map((i) => (
          <div key={i} className="sk h-16 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!state.list.length) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        <p className="text-3xl mb-2">📭</p>
        No {docType === 'resume' ? 'resumes' : 'CVs'} uploaded yet.
      </div>
    )
  }

  return (
    <div>
      {state.list.map((doc) => (
        <DocumentRow key={doc._id} doc={doc} docType={docType} />
      ))}
    </div>
  )
}

function ResumeManager() {
  const dispatch = useDispatch()
  const [tab, setTab] = useState('resume')

  const resumeState = useSelector(selectResumeState)
  const cvState     = useSelector(selectCVState)
  const activeState = tab === 'resume' ? resumeState : cvState

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      <div className="flex items-center gap-2 mb-6">
        <span className="edu-accent-bar" style={{ height: '1.8rem' }} />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Resume & CV Manager
        </h2>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'resume', label: '📋 Resumes' },
          { key: 'cv',     label: '📃 CVs' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${
              tab === key
                ? 'edu-btn-primary border-transparent'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-[var(--edu-accent)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        <UploadCard
          docType={tab}
          state={activeState}
          onClear={() => dispatch(clearMessages(tab))}
        />
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="edu-accent-bar" />
            <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100">
              {tab === 'resume' ? 'Saved Resumes' : 'Saved CVs'}
            </h3>
            <span className="ml-auto edu-badge text-xs">
              {activeState.list.length}
            </span>
          </div>
          <DocumentList docType={tab} />
        </div>
      </div>
    </div>
  )
}

export default ResumeManager