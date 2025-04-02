import { useFormContext } from 'react-hook-form';

const LoginInfo = () => {
  const { register, formState: { errors }, watch } = useFormContext();
  const password = watch('password');

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="username" className="block mb-1 font-medium">
          Username
        </label>
        <input
          {...register('username', { required: 'Username is required' })}
          id="username"
          type="text"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.username && (
          <p className="mt-1 text-red-500 text-sm">{errors.username.message as string}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
          })}
          id="password"
          type="password"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.password && (
          <p className="mt-1 text-red-500 text-sm">{errors.password.message as string}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-1 font-medium">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match',
          })}
          id="confirmPassword"
          type="password"
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default LoginInfo;