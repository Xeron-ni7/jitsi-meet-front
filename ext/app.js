const option={
    hosts:{
        domain:"192.168.0.150",
        muc:"conference.192.168.0.150",
        anonymousdomain:"192.168.0.150"
    },
    bosh :"https://192.168.0.150/http-bind"


    // hosts: {
    //     domain: 'jitsi-meet.example.com',
    //     muc: 'conference.jitsi-meet.example.com' // FIXME: use XEP-0030
    // },
    // bosh: '//jitsi-meet.example.com/http-bind', // FIXME: use xep-0156 for that

    // // The name of client node advertised in XEP-0115 'c' stanza
    // clientNode: 'http://jitsi.org/jitsimeet'
};

const confOption={
    openBridgeChannel : true
};


let connection=null;
let isJoined=false;
let room=null;


let localTrack=[];
const remoteTracks={};

/**
 * Handles remote tracks
 * @param track JitsiTrack object
 */
function onRemoteTrack(track) {
    if (track.isLocal()) {
        return;
    }
    const participant = track.getParticipantId();

    if (!remoteTracks[participant]) {
        remoteTracks[participant] = [];
    }
    const idx = remoteTracks[participant].push(track);

    track.addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
    track.addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log('remote track muted'));
    track.addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.log('remote track stoped'));
    track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        deviceId =>
            console.log(
                `track audio output device was changed to ${deviceId}`));
    const id = participant + track.getType() + idx;

    if (track.getType() === 'video') {
        $('body').append(
            `<video autoplay='1' id='${participant}video${idx}' />`);
    } else {
        $('body').append(
            `<audio autoplay='1' id='${participant}audio${idx}' />`);
    }
    track.attach($(`#${id}`)[0]);
}



//============ lOCAL TRACK  CHECKER ==========


const onLocalTracks=(tracks)=> {
    localTracks = tracks;
    for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            audioLevel => console.log(`Audio Level local: ${audioLevel}`));
        localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log('local track muted'));
        localTracks[i].addEventListener(
            JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            () => console.log('local track stoped'));
        localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            deviceId =>
                console.log(
                    `track audio output device was changed to ${deviceId}`));
        if (localTracks[i].getType() === 'video') {
            $('body').append(`<video autoplay='1' id='localVideo${i}' />`);
            localTracks[i].attach($(`#localVideo${i}`)[0]);
        } else {
            $('body').append(
                `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
            localTracks[i].attach($(`#localAudio${i}`)[0]);
        }
        // if (isJoined) {
        //     room.addTrack(localTracks[i]);
        // }
    }
}


function onConferenceJoined() {
    alert("clear");
    console.log('#############conference joined!##############');
    isJoined = true;
    for (let i = 0; i < localTracks.length; i++) {
        room.addTrack(localTracks[i]);
    }
    console.clear();
    alert(room);
    console.log(room);
}


const onConnectionSuccess=()=>{

    alert("--------------------------------connected");
    room=connection.initJitsiConference('hi7000',confOption);
    room.on(
        JitsiMeetJS.events.conference.CONFERENCE_JOINED,
        onConferenceJoined);
        room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);

        room.join();
}


const onConnectionFail=(a)=>{
    coinsole.log(a);
    console.log("connection failed");
}


const initOptions = {
    disableAudioLevels: false,

    // The ID of the jidesha extension for Chrome.
    desktopSharingChromeExtId: 'mbocklcggfhnbahlnepmldehdhpjfcjp',

    // Whether desktop sharing should be disabled on Chrome.
    desktopSharingChromeDisabled: false,

    // The media sources to use when using screen sharing with the Chrome
    // extension.
    desktopSharingChromeSources: [ 'screen', 'window' ],

    // Required version of Chrome extension
    desktopSharingChromeMinExtVersion: '0.1',

    // Whether desktop sharing should be disabled on Firefox.
    desktopSharingFirefoxDisabled: true
};



const Start= async ()=>{
    JitsiMeetJS.init(initOptions);

connection=new JitsiMeetJS.JitsiConnection(null,"asdnoncla#252k3rk3m3",option);


connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,onConnectionSuccess);
connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED,onConnectionFail);

 connection.connect();

JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })
    .then(onLocalTracks)
    .catch(error => {
        throw error;
    });

    if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
        JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
            const audioOutputDevices
                = devices.filter(d => d.kind === 'audiooutput');
                $('#audioOutputSelectWrapper').show();
            // if (audioOutputDevices.length >= 1) {
            //     // $('#audioOutputSelect').html(
            //     //     audioOutputDevices
            //     //         .map(
            //     //             d =>
            //     //                 `<option value="${d.deviceId}">${d.label}</option>`)
            //     //         .join('\n'));
    
               
            // }
        });
}
}


const getData=()=>{
    $.ajax({
        url:"https://jsonplaceholder.typicode.com/todos/1",
        method:"get",
        success:(res)=>{
            console.log(res)
        },error:(err)=>{
            console.error("errrr: "+err);
        }
    })
}





