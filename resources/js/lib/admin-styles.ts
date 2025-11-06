/**
 * Universal Dark Mode Styling Constants for Admin Pages
 * 
 * These classes ensure consistent light/dark mode styling across all admin pages.
 * Use these constants instead of hardcoding classes to maintain uniformity.
 */

export const adminStyles = {
  // Page Containers
  page: {
    container: 'flex h-full flex-1 flex-col gap-6 p-6 bg-gray-50 min-h-screen',
    innerContainer: 'max-w-7xl mx-auto sm:px-6 lg:px-8',
  },

  // Cards
  card: {
    base: 'bg-white rounded-lg border border-gray-200 shadow-sm',
    header: 'p-6 border-b border-gray-200',
    content: 'p-6',
  },

  // Statistics Cards
  statsCard: {
    container: 'bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow',
    iconWrapper: (color: string) => `w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`,
    icon: (color: string) => `text-${color}-600 text-xl`,
    label: 'text-sm font-medium text-gray-500',
    value: 'text-2xl font-bold text-gray-900',
  },

  // Text
  text: {
    heading: 'text-3xl font-bold text-gray-900',
    subheading: 'text-xl font-semibold text-gray-900',
    body: 'text-gray-700',
    muted: 'text-gray-500',
    error: 'text-red-600',
    success: 'text-green-600',
  },

  // Tables
  table: {
    container: 'bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm',
    header: 'bg-gray-50 border-b border-gray-200',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    row: 'border-b border-gray-200 hover:bg-gray-50 transition-colors',
    cell: 'px-6 py-4 text-sm text-gray-900',
  },

  // Inputs
  input: {
    base: 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500',
    label: 'text-sm font-medium text-gray-700',
  },

  // Buttons
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  },

  // Badges
  badge: {
    admin: 'bg-purple-100 text-purple-800',
    employee: 'bg-blue-100 text-blue-800',
    customer: 'bg-green-100 text-green-800',
    default: 'bg-gray-100 text-gray-800',
  },

  // Alerts
  alert: {
    success: 'border-green-500 bg-green-50 text-green-800',
    error: 'border-red-500 bg-red-50 text-red-800',
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
    info: 'border-blue-500 bg-blue-50 text-blue-800',
  },

  // Dialogs/Modals
  dialog: {
    overlay: 'bg-black/50',
    content: 'bg-white border border-gray-200',
    header: 'border-b border-gray-200',
    title: 'text-xl font-semibold text-gray-900',
    description: 'text-sm text-gray-500',
  },

  // Search Bar
  search: {
    container: 'bg-white rounded-lg border border-gray-200 p-4 shadow-sm',
    input: 'bg-gray-50 border border-gray-300 text-gray-900',
  },
};

