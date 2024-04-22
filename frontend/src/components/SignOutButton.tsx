import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import UseAppContext from "../contexts/AppContext";
const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = UseAppContext();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Signed Out!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });
  const handleClick = () => {
    mutation.mutate();
  };
  return (
    <button
      onClick={handleClick}
      className='text-blue-600 px-3 font-bold bg-white hover:bg-gray-100'
    >
      Sign out
    </button>
  );
};
export default SignOutButton;
