const serverURL = "http://192.168.1.107:8000";

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
  const result = await fetch(`${serverURL}/user-exists?email=${email}`, {
    method: "GET",
  }).then((resp) => resp.json());

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

export { serverURL, registerAPIUser, APIUserExists, getAPIUser };
