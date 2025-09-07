import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "@/utils/api";
import { getUser } from "@/utils/authStorage";
const DeleteUserModal = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "I want") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleDelete = async () => {
    const user = getUser();
    if (user && user.userId) {
      const userId = Number(user.userId);
      setIsDeleting(true);
      try {
        await deleteAccount(userId);
        navigate("/login");
      } catch (error) {
        console.error("Failed to delete account:", error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box flex flex-col items-center">
          <h3 className="text-lg font-bold">Are you sure ?</h3>
          <p className="py-4">Type "I want" for delete account.</p>
          <input
            onChange={validateInput}
            type="text"
            maxLength={6}
            placeholder="I want"
            className="input input-neutral"
          />
          <button
            disabled={disabled || isDeleting}
            className="btn btn-active btn-error mt-2.5"
            onClick={handleDelete}
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner"></span>
                Deleting...
              </>
            ) : (
              "Delete account"
            )}
          </button>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7"></label>
      </div>
    </>
  );
};
export default DeleteUserModal;
