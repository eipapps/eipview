<template>
  <v-layout
    column
    v-if="IMComponent"
    :class="conversation ? 'chat my-0 py-0 elevation-15' : ''"
  >
    <!-- CONVERSATION ROOM STARTS -->
    <v-card
      dark
      v-show="conversation"
      class
    >
      <!-- CONVERSATION TITLE STARTS -->
      <v-card-title class="my-0 py-0 grey darken-4">
        <v-layout
          row
          justify-space-between
          align-center
        >
          <v-avatar
            size="35"
            color="red"
            class="mr-2"
          >
            <img
              :src="participant.photoURL"
              alt="alt"
            >
          </v-avatar>
          {{ participant.firstName }}
          <v-layout
            row
            justify-end
            align-center
          >
            <v-btn
              round
              icon
              small
              class="mx-1 pa-0"
              @click="conversation = false"
            >
              <v-icon small>
                minimize
              </v-icon>
            </v-btn>
            <v-btn
              round
              icon
              small
              class="ma-0 pa-0"
              @click="closeIM"
            >
              <v-icon small>
                close
              </v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
      </v-card-title>
      <!-- CONVERSATION TITLE ENDS -->

      <!--  CONVERSATION BODY STARTS -->
      <v-card
        height="260px"
        class="scrollbar chatCard grey "
        id="thread"
        v-if="conversation"
      >
        <v-btn
          flat
          light
          small
        >
          ver más<v-icon class="mx-2">
            cached
          </v-icon>
        </v-btn>
        <v-card-text
          class="scrollbar"
          v-for="message in messages"
          :key="message._id"
        >
          <v-tooltip
            top
            v-if="message.from == currentUser.uid"
          >
            <template v-slot:activator="{ on }">
              <v-layout
                v-on="on"
                row
                justify-start
                align-start
              >
                <v-card
                  class="mr-3 sent mx-1"
                  light
                >
                  <span class="mr-5">{{ message.body }}</span>
                  <span class="caption timestamp ml-5">
                    {{ formatTime(message.date) }}
                    <v-icon
                      v-if="message.sent"
                      small
                    >done</v-icon>
                    <v-icon
                      v-if="message.delivered"
                      small
                    >done_all</v-icon>
                    <v-icon
                      v-if="message.read"
                      small
                      color="#c6192a"
                    >done_all</v-icon>
                  </span>
                </v-card>
                <v-avatar
                  size="30"
                  color="red"
                  class="my-3"
                >
                  <img
                    :src="currentUser.photoURL"
                    alt="alt"
                  >
                </v-avatar>
              </v-layout>
            </template>

            <span>{{ formatDate(message.date) }}</span>
          </v-tooltip>

          <v-tooltip
            top
            v-else
          >
            <template v-slot:activator="{ on }">
              <v-layout
                row
                justify-end
                align-start
                v-on="on"
              >
                <v-avatar
                  size="30"
                  color="red"
                  class="my-3"
                >
                  <img
                    :src="participant.photoURL"
                    alt="alt"
                  >
                </v-avatar>
                <v-card
                  class="ml-3 received px-1"
                  light
                >
                  <span class="mr-5">{{ message.body }}</span>
                  <br>
                  <span
                    class="caption timestamp mr-1"
                    flat
                  >
                    {{
                      formatTime(message.date)
                    }}
                  </span>
                </v-card>
              </v-layout>
            </template>

            <span>{{ formatDate(message.date) }}</span>
          </v-tooltip>
        </v-card-text>
        <!-- ISWRTING STARTS -->
        <v-layout
          row
          justify-end
          align-end
        >
          <transition name="slideDown">
            <span
              v-if="isTyping"
              class="py-0 typing title font-weight-bold black--text"
            >. . .</span>
          </transition>
        </v-layout>
        <!-- ISWRTING ENDS -->
      </v-card>
      <!--  CONVERSATION BODY ENDS -->
      <!-- CONVERSATION ACTION STARTS -->
      <v-card class="px-2 grey darken-4">
        <v-layout row>
          <v-text-field
            @keydown.enter="sendMessage"
            v-model="input"
            label="escribe mensaje"
            type="text"
            autofocus
          />
          <v-btn
            @click="sendMessage"
            small
            fab
            class="mx-0 px-0"
          >
            <v-icon small>
              send
            </v-icon>
          </v-btn>
        </v-layout>
      </v-card>
      <!-- CONVERSATION ACTION ENDS -->
    </v-card>
    <!-- CONVERSATION  ENDS -->
    <!-- MINIMIZED VERSION STARTS -->
    <v-card
      v-if="!conversation"
      class="btn grey darken-4"
    >
      <v-btn
        v-if="!conversation"
        x-large
        dark
        flat
        @click="openIM(participant)"
      >
        <v-avatar
          size="40"
          color="red"
          class="mx-2"
        >
          <img
            :src="participant.photoURL"
            alt="alt"
          >
        </v-avatar>
        {{ participant.firstName }} {{ participant.lastName }}
      </v-btn>
    </v-card>
    <!-- MINIMIZED VERSION ENDS -->
  </v-layout>
</template>

<script>

import {format} from "date-fns";
import socket from "socket.io-client";
export default {
  data() {
    return {
      conversation: false,
      IMComponent: false,
      currentUser: this.$store.getters.auth().currentUser,
      participant: {},
      io: null,
      input: "",
      isTyping: false,
      message: "",
      messages: [],
      chatRoom_id: "",
      timeOut: null,
      invitationWasAccepted: false,
    };
  },
  methods: {
    /**
     * Formats the date to day/month/year
     * @param date:Date
     */
    formatDate(date) {
      return format(new Date(date), "d/m/yyyy");
    },
    /**
     * @function formatDate(date) formats the date to hh:mm a @example 12:00 pm
     * @param date:Date
     */
    formatTime(time) {
      return format(new Date(time),"hh:mm a");
    },
    // opens the private message component
    openIM(receivedParticipant) {
      return new Promise((resolve, reject) => {
        if (!receivedParticipant)reject(new Error("there was not recipient for this conversation"));
        this.participant = receivedParticipant;
        this.IMComponent = true;
        this.conversation = true;
        resolve();
      });
    },
    // opens the private message component
    closeIM() {
      this.conversation = false;
      this.IMComponent = false;
      this.disconnectFromChatRoom();
      this.chatRoom_id = "";
    },
    /**
     * Emits a message socket with opens the channel for the first time {to: uid, from:uid, body: String}
     */
    startPrivateChat() {
      // console.log('startPrivateChat')
      this.io.emit("startPrivateChat", {
        to: this.participant.cu_id,
        from: this.currentUser.uid,
        body: this.input
      });
      this.input = "";
    },
    /**
     * Listens to socket call to the currentUser.userId to start a privateChat.
     * the parameter received is an array: message[sender:Object, body:String, chatRoom_id]
     * it launches the IM to start the chat, and emits acceptInvitationToPrivateChat(chatroom_id)
     */
    onInvitationToPrivateChat() {
      this.io.on(this.currentUser.uid, message => {
        this.openIM(message[0]).then(() => {
          this.io.emit("acceptInvitationToPrivateChat", message[1]);
          // get chatRoomId when confirming invitation and  save it locally
          // console.log('onInvitationToPrivateChat',message[1])
          this.chatRoom_id = message[1];
        });
      });
    },
    /**
     * Listens a socket, receives a boolean,
     * toggles isTyping to show that the participant is typing
     */
    onIstyping() {
      this.io.on("isTyping", answer => {
        // console.log(answer);
        this.isTyping = answer;
        this.timeOut = setTimeout(() => (this.isTyping = false), 10);
      });
    },
    /**
     * Decides whether it is the first time a message is sent, 
     * it then decides to call startPrivateChat or sendToChat
     */
    sendMessage() {
      // console.log('this.messages.length:',this.messages.length);
      // console.log('this.chatRoom_id:', this.chatRoom_id);
      if (!this.invitationWasAccepted) {
        this.startPrivateChat();
      } else {
        this.sendToExistingChat();
      }
    },
    /**
     * Composes a message:{from: uid, to: uid,  message:String, chatRoom_id: uid}
     * emits the message to emiSendToExistingChat, then triggers emitMessageThread on the server
     */
    sendToExistingChat() {
      if (this.input && this.chatRoom_id) {
        const newMessage = {
          to: this.participant.cu_id,
          from: this.currentUser.uid,
          body: this.input,
          chatRoom_id: this.chatRoom_id
        };
        this.io.emit("sendToExistingChat", newMessage);
        this.messages.push(newMessage);
        this.input = "";
      }
    },
    /**
     * Expects an array and saves it locally if the local array is empty,
     * if the incomming array is longer, it pushes the last values to this.messages[];
     * ; this will prevent refreshing the template iteration.
     */
    onMessageThread() {
      this.io.on("messageThread",async inComingMessages => {
          await inComingMessages.sort((a,b)=> new Date(a.date)- new Date(b.date)) //reverse the array 
          this.messages = inComingMessages;
        });
    },
    /**
     * Expects an array and saves it locally if the local array is empty
     * ; this will prevent refreshing the template iteration.
     */
    onFirstMessageThread() {
      this.io.on(`${this.currentUser.uid}firstRefresh`,async messages => {
         await messages.sort((a,b)=> new Date(a.date)- new Date(b.date))
          this.messages =  messages;
          // set local chatRoom_id  since the messages carry the chatRoom_id
          this.chatRoom_id = messages[0].chatRoom_id;
        });
    },
    /**
     * Emits a message requesting what's on the database
     * from a conversation between these two participants. {from:uid, to:uid, JWT}
     * @param withChatRoomId:boolean to determine the method to get the data (participants or chatRoomID)
     */
    refreshMessageThread(withChatRoomId) {
      if (this.participant.cu_id) {
        this.io.emit("refreshMessageThread", {
          to: this.participant.cu_id,
          from: this.currentUser.uid,
          chatRoom_id: this.chatRoom_id,
          // JWT: localStorage.getItem("serverToken"),
          withChatRoomId: withChatRoomId
        });
      }
    },
    /**
     * Listens to invitationToPrivateChatWasAccepted saves it locally
     * to make the decision in sendMessage()
     */
    onInvitationToPrivateChatWasAccepted(){
      this.io.on('invitationToPrivateChatWasAccepted',(respose)=>{
        this.invitationWasAccepted = respose;
      });
    },
    /**
     * Emits a request to disconnect the user from the current channel
     */
    disconnectFromChatRoom() {
      this.io.emit("removeFromChatRoom", this.currentUser.uid);
    }
  },
  watch: {
    input() {
      // emits a socket when currentUser types
      this.io.emit("isTyping", this.chatRoom_id);
    }
  },
  created() {
    this.io = socket.connect("https://eip-server.herokuapp.com/"); //start a socket connection
    this.onFirstMessageThread();
    this.onMessageThread();
    this.onInvitationToPrivateChat();
    this.onIstyping();
    this.onInvitationToPrivateChatWasAccepted();
    this.$root.$on("openIM", participant => {
      this.openIM(participant).then(this.refreshMessageThread(false));
    });
  },
  updated(){
    if(document.getElementById('thread')){
      document.getElementById('thread').scrollTop =  (document.getElementById('thread')) ? document.getElementById('thread').scrollHeight : 0;

    }
  },
  beforeDestroy() {
    clearTimeout(this.timeOut);
  }
};
</script>

<style>
.typing {
  animation: rubberBand 1s infinite;
}
.chat {
  width: 300px;
  max-height: 370px;
  z-index: 2;
  position: fixed;
  bottom: 1px;
  right: 2px;
  text-align: center;
  animation-duration: 0.1s;
  animation-name: slideInUp;
  animation-timing-function: ease-in-out;
  display: block;
}
@media screen and (min-width: 700px) {
  .chat {
    width: 400px;
    max-height: 370px;
    z-index: 2;
    position: fixed;
    bottom: 1px;
    right: 2px;
    text-align: center;
    animation-duration: 0.1s;
    animation-name: slideInUp;
    animation-timing-function: ease-in-out;
    display: block;
  }
}
.btn {
  z-index: 1;
  position: fixed;
  bottom: 0px;
  right: 170px;
  text-align: center;
  animation-duration: 0.1s;
  animation-name: slideInUp;
  animation-timing-function: ease-in-out;
  display: block;
}
.chatCard {
  overflow-y: scroll;
  overflow-x: hidden;
  text-overflow: clip;
  border: 1px solid black !important;
}

.scrollbar::-webkit-scrollbar {
  width: 0.7em;
}

.scrollbar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: #376092;
  border-radius: 25px;
}

.sent {
  width: 95%;
  min-height: 50px;
  text-align: left;
  padding: 5px;
  background: rgba(47, 166, 202, 0.527) !important;
  position: relative;
  border-radius: 6px;
  -moz-boder-radius: 6px;
  -webkit-border-radius: 6px;
}
.sent:after {
  content: "";
  z-index: 1;
  position: absolute;
  width: 0;
  height: 0;
  border-bottom: 15px solid rgba(47, 166, 202, 0.527);
  border-right: 20px solid transparent;
  left: 100%;
  top: 10px;
}

.received {
  width: 95%;
  min-height: 50px;
  text-align: left;
  padding: 5px;
  background: rgba(255, 255, 255, 0.815) !important;
  position: relative;
  border-radius: 6px;
  -moz-boder-radius: 6px;
  -webkit-border-radius: 6px;
}
.received:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-bottom: 15px solid rgba(255, 255, 255, 0.815);
  border-left: 20px solid transparent;
  right: 100%;
  top: 10px;
}
.timestamp {
  position: absolute;
  bottom: 1px;
  right: 1px;
}
</style>
