// const serverURL = "https://52.74.235.69.nip.io";
const serverURL = "http://0.0.0.0:8000";

interface APIUser {
  url: string;
  name: string;
  email: string;
  department: string;
  team_color: string;
}

const registerAPIUser = async (
  accessToken: string,
  name: string,
  email: string,
  user_type: string | null,
  department: string | null,
  team_color: string | null
) => {
  await fetch(`${serverURL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${accessToken}`,
    },
    body: JSON.stringify({
      name,
      email,
      user_type,
      department,
      team_color,
    }),
  });
};

const APIUserExists = async (email: string) => {
  const result = await fetch(
    `${serverURL}/user-exists?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
    }
  ).then((resp) => resp.json());

  return result["exists"];
};

const getAPIUser = async (email: string, accessToken: string) => {
  const result = await fetch(
    `${serverURL}/users/email/?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    }
  );

  return (await result.json()) as APIUser;
};

const deleteAPIUser = async (email: string, accessToken: string) => {
  await fetch(`${serverURL}/users/delete/?email=${encodeURIComponent(email)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  });
};

export { serverURL, registerAPIUser, APIUserExists, getAPIUser, deleteAPIUser };
