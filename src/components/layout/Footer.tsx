export function Footer() {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white py-4">
      <p className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} tentwenty. All rights reserved.
      </p>
    </div>
  );
}
