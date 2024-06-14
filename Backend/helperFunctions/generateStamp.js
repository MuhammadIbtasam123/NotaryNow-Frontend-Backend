import { createCanvas } from "canvas";

// Function to generate the profile image
async function generateStamp(
  username,
  identityNumber,
  licenseNumber,
  contactNumber
) {
  // Create canvas
  const canvas = createCanvas(330, 160);
  const ctx = canvas.getContext("2d");

  // Draw shimmery golden-colored rectangle
  const gradient = ctx.createLinearGradient(0, 0, 330, 160);
  gradient.addColorStop(0, "#FFD700");
  gradient.addColorStop(0.3, "#FFFF00"); // Adjusted to maintain uniformity
  gradient.addColorStop(0.8, "#FFD700"); // Adjusted to maintain uniformity
  gradient.addColorStop(1, "#FFFF00");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 330, 160);

  // Draw text
  ctx.font = "bold 30px Times New Roman";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  // Username
  ctx.fillText(username, 165, 35);

  // Draw line
  ctx.beginPath();
  ctx.moveTo(20, 50); // Start point (X, Y)
  ctx.lineTo(310, 50); // End point (X, Y)
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "bold 18px Arial";

  // Notary Public
  ctx.fillText("Notary Public", 165, 70);

  ctx.beginPath();
  ctx.moveTo(20, 80); // Start point (X, Y)
  ctx.lineTo(310, 80); // End point (X, Y)
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Contact Number
  ctx.fillText(`Contact Number ${contactNumber}`, 165, 105);

  // License Number
  ctx.fillText(`License Number ${licenseNumber}`, 165, 125);

  // Identity Number
  ctx.fillText(`Identity Number ${identityNumber}`, 165, 145);

  // Convert canvas to JPEG buffer
  const imageBuffer = canvas.toBuffer("image/jpeg");

  return imageBuffer;
}

export default generateStamp;
