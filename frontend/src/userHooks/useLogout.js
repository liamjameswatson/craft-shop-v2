import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "./userHooksApi";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
      console.log("success");
    },
  });

  return { logout, isLoading };
}
