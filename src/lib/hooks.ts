export default async function API(
  method: string,
  endpoint: string,
  payload?: object
) {
  try {
    const options: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Only include body if method is POST or PUT
    if (method === "POST" || method === "PUT") {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error("Failed to save content");
    }

    const data = await response.json();
    return data;
    console.log("Content saved successfully:", data);
  } catch (error) {
    console.error("Error saving content:", error);
  }
}
