// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAl3_fbIVtCjQ39RXE9zWDWP8evtlVg0gs",
  authDomain: "nxt-level-fitnesss.firebaseapp.com",
  projectId: "nxt-level-fitnesss",
  storageBucket: "nxt-level-fitnesss.firebasestorage.app",
  messagingSenderId: "13739266505",
  appId: "1:13739266505:web:8da5aaf176aa5ac86cd818",
  measurementId: "G-NVCD811462"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Message sending function
function sendMessage() {
  const messageText = $('#message').val();
  if (messageText.trim() === "") return;

  const user = auth.currentUser;
  if (user) {
    db.ref('messages').push({
      userId: user.uid,
      text: messageText,
      timestamp: Date.now()
    });

    $('#message').val('');
  }
}

// Display Messages with left-right alignment
db.ref('messages').on('child_added', (snapshot) => {
  const data = snapshot.val();
  const currentUser = auth.currentUser;

  // Check if the message is sent by the current user or others
  const messageClass = currentUser && data.userId === currentUser.uid ? 'sent' : 'received';
  
  // Create message element without username
  const messageElement = `
    <div class="message ${messageClass}">
      ${data.text}
      <div class="timestamp">${formatTime(data.timestamp)}</div>
    </div>
  `;
  
  $('#messages').append(messageElement);
  $('#messages').scrollTop($('#messages')[0].scrollHeight); // Auto-scroll to the latest message
});

// Format timestamp for display
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
}

// Authentication, Login, and Logout
$('#login-button').click(() => {
  const email = $('#login-email').val();
  const password = $('#login-password').val();
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      $('#auth-container').hide();
      $('#chat-container').show();
    })
    .catch(error => alert(error.message));
});

$('#register-button').click(() => {
  const email = $('#register-email').val();
  const password = $('#register-password').val();
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert('User registered successfully!'))
    .catch(error => alert(error.message));
});

$('#logout-button').click(() => {
  auth.signOut().then(() => {
    $('#chat-container').hide();
    $('#auth-container').show();
  });
});

auth.onAuthStateChanged(user => {
  if (user) {
    $('#auth-container').hide();
    $('#chat-container').show();
  } else {
    $('#chat-container').hide();
    $('#auth-container').show();
  }
});

// Send message on button click or Enter key
$('#send-message').on('click', sendMessage);
$('#message').on('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});