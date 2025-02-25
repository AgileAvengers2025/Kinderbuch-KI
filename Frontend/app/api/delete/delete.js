const getAuthHeader = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return token ? `Bearer ${token}` : "";
    }
    return "";
  };

const handleStoryDelete = async (storyId) => {
  try {
    const response = await fetch(`/api/stories/${storyId}`, {
      method: 'DELETE',
      headers: {
      Authorization: getAuthHeader(),
    },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete story');
    }

    // Optionally refresh the stories list or update UI state
    // You might want to remove the story from local state or trigger a refetch
    // For example:
    // setStories(stories.filter(story => story.id !== storyId));
    
  } catch (error) {
    console.error('Error deleting story:', error);
    // Optionally show error message to user
    // You might want to add error handling UI feedback
  }
};