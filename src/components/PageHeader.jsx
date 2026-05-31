export default function PageHeader({ title, description }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </header>
  );
}
