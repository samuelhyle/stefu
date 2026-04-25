import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    show: (message, type = 'info') => addToast({ message, type }),
    success: (message) => addToast({ message, type: 'success' }),
    error: (message) => addToast({ message, type: 'error', duration: 6000 }),
    info: (message) => addToast({ message, type: 'info' }),
    warning: (message) => addToast({ message, type: 'warning', duration: 5000 }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto"
          >
            <div className={`
              flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl backdrop-blur-md border
              ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30' : ''}
              ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' : ''}
              ${toast.type === 'info' ? 'bg-white/10 border-white/20' : ''}
            `}>
              <span className="flex-shrink-0">{icons[toast.type]}</span>
              <p className="text-sm text-white font-medium">{toast.message}</p>
              <button
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}