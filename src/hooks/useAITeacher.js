const { create } = require("zustand");

export const teachers = ["Emma", "Brian"];

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => ({
        ...message,
        audioPlayer: null,  // Reset audio player when changing teacher
      })),
    }));
  },
  classroom: "default",
  setClassroom: (classroom) => {
    set(() => ({ classroom }));
  },
  loading: false,
  english: true,
  setEnglish: (english) => {
    set(() => ({ english }));
  },
  speech: "formal",
  setSpeech: (speech) => {
    set(() => ({ speech }));
  },
  askAI: async (question) => {
    if (!question) return;  // Exit if no question is provided
    const message = {
        question,
        id: get().messages.length,
    };
    set(() => ({ loading: true }));  // Indicate loading state

    const speech = get().speech;
    try {
        const res = await fetch(`/api/ai?question=${question}&speech=${speech}`, {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }  // Assuming you're using authorization
        });
        const data = await res.json();  // Parse the JSON response
        console.log("API Response Data: ", data);  // Log the response data for debugging

        if (!res.ok) {
            throw new Error(`API call failed with status ${res.status}`);  // Check if the response was successful
        }

        // Validate the expected data structure looking for either 'message' or 'response'
        if (typeof data !== 'object' || data === null || (!data.message && !data.response)) {
            throw new Error('Invalid response data');  // Adjusted to check for either key
        }

        // Use either 'message' or 'response' from the data, prioritizing 'message' if both exist
        const apiResponse = data.message || data.response;

        // Construct the answer using the appropriate field from the response
        message.answer = `${apiResponse}`;
        message.speech = speech;

        set(state => ({
            currentMessage: message,
            messages: [...state.messages, message],
            loading: false,  // Update loading state
        }));
        get().playMessage(message);
    } catch (error) {
        console.error('Error in askAI:', error);  // Log any errors
        set(() => ({ loading: false }));  // Ensure loading state is cleared on error
    }
},
playMessage: async (message) => {
  if (!message.audioPlayer) {
    try {
      const audioRes = await fetch(`/api/tts?teacher=${get().teacher}&text=${encodeURIComponent(message.answer)}`, {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }  // Assuming API key is needed for TTS as well
      });
      if (!audioRes.ok) throw new Error(`TTS API call failed with status ${audioRes.status}`);

      const audio = await audioRes.blob();
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      // Corrected variable name for fetching viseme data from response headers
      const visemeData = await audioRes.headers.get('Visemes'); // Assuming viseme data is sent in the response headers
      const visemes = JSON.parse(visemeData || "[]"); // Safely parse the viseme data

      audioPlayer.onended = () => set(() => ({ currentMessage: null }));
      set(() => ({
        messages: get().messages.map(m => m.id === message.id ? { ...m, audioPlayer, visemes } : m),
        loading: false,
      }));

      audioPlayer.play();
    } catch (error) {
      console.error("Error in playMessage:", error);
      set(() => ({ loading: false }));
    }
  }
},
}));
