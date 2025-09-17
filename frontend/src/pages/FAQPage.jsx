export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6 text-forest">FAQ</h1>
      <ul className="space-y-4">
        <li>
          <strong>Q:</strong> How do I register?
          <br />
          <strong>A:</strong> Go to the Register page and fill out the form.
        </li>
        <li>
          <strong>Q:</strong> How do I log in?
          <br />
          <strong>A:</strong> Use your email and password on the Login page.
        </li>
        <li>
          <strong>Q:</strong> How do I reset my password?
          <br />
          <strong>A:</strong> Password reset will be added soon.
        </li>
      </ul>
    </div>
  );
}
