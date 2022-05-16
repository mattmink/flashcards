const SR =
  typeof SpeechRecognition === "undefined"
    ? webkitSpeechRecognition
    : SpeechRecognition;

export default function useSpeechRecognition(
  onResult = () => {},
  onError = () => {}
) {
  const recognition = new SR();

  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const [{ transcript = "" }] = event.results[event.resultIndex];

    onResult(transcript.trim(), event);
  };

  recognition.onerror = (error) => {
    console.error(error);
    onError(error);
  };

  return recognition;
}
