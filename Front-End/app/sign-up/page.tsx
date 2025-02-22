import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our health platform today
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-blue-500 hover:bg-blue-700 text-white",
              footerActionLink: 
                "text-blue-500 hover:text-blue-700",
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
