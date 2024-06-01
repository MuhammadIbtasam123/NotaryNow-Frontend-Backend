export const RoomIdGenerator = async (name) => {
  // Function to generate a room id with format xxx-xxx-xxx
  const generateRoomId = () => {
    let roomId = "";
    const characters = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        roomId += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      if (i < 2) roomId += "-";
    }
    return roomId;
  };

  const roomId = generateRoomId();
  return roomId;
  // const roomId = "tvn-qrn-vld";

  // // Generate the URL with room id and name
  // const url = `https://notarization-session.netlify.app/?room=${roomId}&name=${encodeURIComponent(
  //   name
  // )}`;

  // return url;
};
