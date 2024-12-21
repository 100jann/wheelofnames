document.addEventListener('DOMContentLoaded', () => {
    const players = JSON.parse(document.cookie.split('; ').find(cookie => cookie.startsWith('players='))?.split('=')[1] || '[]');
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-btn');
    const resultElement = document.getElementById('result');
    const radius = Math.min(window.innerWidth * 0.9, 400) / 2; // Radius for responsive design

    canvas.width = canvas.height = radius * 2;

    const anglePerSegment = 360 / players.length; // Angle per segment
    let currentRotation = 0;

    // Draw the Wheel
    function drawWheel() {
        players.forEach((player, index) => {
            const startAngle = (index * anglePerSegment * Math.PI) / 180;
            const endAngle = ((index + 1) * anglePerSegment * Math.PI) / 180;

            // Draw segment
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius, startAngle, endAngle);
            ctx.fillStyle = `hsl(${index * (360 / players.length)}, 70%, 80%)`;
            ctx.fill();
            ctx.closePath();

            // Add Player Name
            const textAngle = startAngle + (endAngle - startAngle) / 2;
            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(textAngle);
            ctx.textAlign = 'left';
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText(player, radius - 10, 10);
            ctx.restore();
        });
    }

    drawWheel();

    // Spin the Wheel
    spinButton.addEventListener('click', () => {
        const spins = Math.random() * 5 + 5; // Random spins (5–10)
        const targetIndex = Math.floor(Math.random() * players.length); // Random player
        const targetRotation = spins * 360 + targetIndex * anglePerSegment + anglePerSegment / 2; // Align with indicator

        currentRotation = targetRotation;

        canvas.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            // Normalize rotation
            const normalizedRotation = (360 - (currentRotation % 360)) % 360;
            const selectedIndex = Math.floor(normalizedRotation / anglePerSegment) % players.length;

            const winner = players[selectedIndex];

            // Display result
            resultElement.innerText = `${winner} wins!`;
        }, 4000); // Wait for spin animation to complete
    });
});
