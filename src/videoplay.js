import React, {useState, useRef} from "react"
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ReactPlayer from 'react-player';
import PlayerControls from "./components/PlayerControls";
import screenFull from 'screenfull'
import {Grid} from "@material-ui/core";
import Paper from "@material-ui/core/Paper"

const useStyles = makeStyles({
    playerWrapper: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
});
const format = (seconds) => {
    if (isNaN(seconds)) {
        return '00.00'
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, "0")
    if (hh) {
        return `${hh}: ${mm.toString().padStart(2, "0")}: ${ss}`
    }
    return `${mm}:${ss}`;
}

let count;
count = 0;
function VideoPlay() {
    const classes = useStyles();
    const [state, setState] = useState({
        playing: true,
        muted: false,
        volume: 0.5,
        playbackRate: 1.0,
        played: 0,
        seeking: false
    })

    const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");

    const [bookmarks, setBookmarks] = useState([])
    const addBookmark = () => {
        const canvas = canvasRef.current
        canvas.width = 160
        canvas.height = 90

        const ctx = canvas.getContext("2d")
        ctx .drawImage(playerRef.current.getInternalPlayer(), 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL(0);
        canvas.width = 0;
        canvas.height = 0;

        setBookmarks([
            ...bookmarks,{
                time: currentTime, display:elapsedTime, image:imageUrl
            },
        ]);

    }
    const handlePlayPause = () => {
        setState({...state, playing: !state.playing});
    }
    const {playing, muted, volume, playbackRate, played, seeking} = state;
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const controlsRef = useRef(null);

    const handleRewind = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
    }

    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
    }
    const handleMute = () => {
        setState({...state, muted: !state.muted});
    }

    const handleVolumeChange = (e, newValue) => {
        setState({
            ...state, volume: parseFloat(newValue / 100),
            muted: newValue === 0 ? true : false
        });
    }
    const handleVolumeSeekUp = (e, newValue) => {
        setState({
            ...state, volume: parseFloat(newValue / 100),
            muted: newValue === 0 ? true : false
        });
    }

    const handlePlaybackRateChange = (rate) => {
        setState({
            ...state, playbackRate: rate
        });
    }

    const toggleFullScreen = () => {
        screenFull.toggle(playerContainerRef.current)
    }
    const handleProgress = (changeState) => {
        if(count > 3){
            controlsRef.current.style.visibility ="hidden"
            count = 0
        }
        if(controlsRef.current.style.visibility =='visible'){
            count++
        }
        if (!state.seeking) {
            setState({...state, ...changeState});

        }
    };

    const handleSeekChange = (e, newValue) => {
        setState({...state, played: parseFloat(newValue / 100)});
    }
    const handleSeekMouseDown = (e) => {
        setState({...state, seeking: true})
    }
    const handleSeekMouseUp = (e, newValue) => {
        setState({...state, seeking: false});
        playerRef.current.seekTo(newValue / 100)
    }

    const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00'
    const duration = playerRef.current ? playerRef.current.getDuration() : '00:00'
    const elapsedTime = timeDisplayFormat === "normal" ? format(currentTime) : `-${format(duration - currentTime)}`;
    const totalDuration = format(duration)

    const handleChangeDisplayFormat = () => {
        setTimeDisplayFormat(
            timeDisplayFormat === 'normal' ? 'remaining' : 'normal'
        );
    };

    const handleMouseMove=()=>{
        controlsRef.current.style.visibility ="visible";
        count = 0 ;
    }
    return (
        <>

            <Toolbar/>
            <Container maxWidth="md">
                <div ref={playerContainerRef} className={classes.playerWrapper} onMouseMove={handleMouseMove}>
                    <ReactPlayer
                        ref={playerRef}
                        width={"100%"}
                        height={"100%"}
                        url="https://www.cdc.gov/wcms/video/low-res/coronavirus/2020/296296wear-mask-60-asl.mp4"
                        muted={muted}
                        playing={playing}
                        volume={volume}
                        playbackRate={playbackRate}
                        onProgress={handleProgress}
                        config={{
                            file:{
                                attributes:{
                                    crossorigin:"anonymous",
                                },
                            },
                        }}
                    />
                    <PlayerControls
                        ref={controlsRef}
                        onPlayPause={handlePlayPause} playing={playing}
                        playing={playing}
                        onRewind={handleRewind}
                        onFastForward={handleFastForward}
                        muted={muted}
                        onMute={handleMute}
                        onVolumeChange={handleVolumeChange}
                        onVolumeSeekUp={handleVolumeSeekUp}
                        volume={volume}
                        playbackRate={playbackRate}
                        onPlaybackRateChange={handlePlaybackRateChange}
                        onToggleFullScreen={toggleFullScreen}
                        played={played}
                        onSeek={handleSeekChange}
                        onSeekMouseDown={handleSeekMouseDown}
                        onSeekMouseUp={handleSeekMouseUp}
                        elapsedTime={elapsedTime}
                        totalDuration={totalDuration}
                        onChangeDisplayFormat={handleChangeDisplayFormat}
                        onBookmark={addBookmark}
                    />
                </div>
                <Grid container style={{marginTop: 20}} spacing={3}>
                    {bookmarks.map((bookmark, index) => (
                        <Grid item key={index}>
                            <Paper onClick={()=> playerRef.current.seekTo(bookmark.time)}>
                                <img crossOrigin={"anonymous"} src={bookmark.image}/>
                                <Typography>Bookmark at {bookmark.display}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                <canvas ref={canvasRef}></canvas>
            </Container>
        </>
    );
}

export default VideoPlay;
