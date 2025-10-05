{/* Boot messages removed for macOS-style boot */}
<div className="text-center mt-4">
  {/* Progress Bar only */}
  {!isBootComplete && (
    <motion.div
      className="w-72 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <motion.div
        className="h-full bg-blue-400"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.2, ease: "linear" }}
      />
    </motion.div>
  )}

  {/* Spotlight prompt after boot completes */}
  {isBootComplete && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-gray-400 text-sm mt-2"
    >
      Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">Alt</kbd> +{" "}
      <kbd className="px-1 py-0.5 bg-gray-700 rounded">Space</kbd> to open
      Spotlight Search.
    </motion.p>
  )}
</div>