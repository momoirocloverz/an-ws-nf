import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  Button,
} from 'antd';
import {
  checkForIdentity,
  checkForVideoLiveness,
  getFacialRecognitionAccessToken,
} from '@/services/agricultureSubsidies';
import styles from '@/components/agricultureSubsidies/FacialRecognition.less';
import {BasicSubsidyUser} from "@/pages/agricultureSubsidies/types";

const livenessThreshold = 0.3;
const identityThreshold = 80;

type propType = {
  user: BasicSubsidyUser | undefined;
  successCb: ()=>unknown;
}

function FacialRecognition({ user, successCb } : propType) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<any>(null);
  const providerRef = useRef({ token: undefined });
  const videoChunk = useRef([]);
  // [waiting, recording, verifying]
  // const [verificationState, setVerificationState] = useState(0);
  const [statusString, setStatusString] = useState('点击开始录制');
  const [isRecordingAllowed, setIsRecordingAllowed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const canRecord = useMemo(() => isRecordingAllowed && !isRecording, [isRecordingAllowed, isRecording]);
  const timer = useRef<number>(null);

  useEffect(() => {
    if (navigator.mediaDevices) {
      getFacialRecognitionAccessToken()
        .then((tokenResult) => {
          providerRef.current.token = tokenResult.data.access_token;
          localStorage.setItem('provider_access_token', JSON.stringify(tokenResult.data));
          navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
              videoRef.current.srcObject = stream;
              videoRef.current.captureStream = videoRef.current.captureStream || videoRef.current.mozCaptureStream; // FF comp
              const mediaRecorder = new MediaRecorder(videoRef.current.captureStream(), {
                mimeType: 'video/webm; codecs=h264',
              });
              mediaRecorder.ondataavailable = (e) => {
                videoChunk.current.push(e.data);
              };
              mediaRecorder.onstop = () => {
                // return successCb();
                setIsRecordingAllowed(false);
                const blob = new Blob(videoChunk.current, {
                  type: 'video/webm',
                });
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64data = reader.result;
                  setStatusString('验证中...');
                  // const savedForm = JSON.parse(localStorage.getItem('wsnf_pending_subsidy_claim_form') ?? '{}');
                  checkForVideoLiveness(providerRef.current.token, base64data)
                    .then((result) => {
                      if (result.data.error_code === 0 && result.data.result.score > livenessThreshold) {
                        return checkForIdentity(
                          providerRef.current.token,
                          result.data.result.best_image.pic,
                          'BASE64',
                          user?.idNumber,
                          user?.name,
                        );
                      }
                      throw new Error('活体验证失败');
                    })
                    .then((result) => {
                      if (result.data.result.verify_status === 0 && result.data.result.score > identityThreshold) {
                        setStatusString('验证成功');
                        if (typeof successCb === 'function') {
                          successCb();
                        }
                      } else {
                        throw new Error('身份验证失败');
                      }
                    })
                    .catch((e) => {
                      setIsRecordingAllowed(true);
                      setStatusString(`验证失败请重新尝试: ${e.message ?? ''}`);
                    });
                };
                reader.readAsDataURL(blob);
              };
              recorderRef.current = mediaRecorder;
              // setVerificationState(1);
              setIsRecordingAllowed(true);
            })
            .catch(() => {
              setIsRecordingAllowed(false);
              setStatusString('获取视频源失败');
            });
          // return getFacialRecognitionActionSequence(tokenResult.data.access_token);
        }).catch(() => {
          setIsRecordingAllowed(false);
          setStatusString('获取第三方密匙失败');
        });
    } else {
      setIsRecordingAllowed(false);
      setStatusString('获取视频源失败,请确保地址是HTTPS');
    }

    return () => {
      if (recorderRef.current) {
        recorderRef.current.ondataavailable = null;
        recorderRef.current.onstop = null;
      }
      const tracks = videoRef.current.srcObject?.getTracks() ?? [];
      tracks.forEach((track) => {
        track.stop();
      });
      if (timer.current) {
        clearTimeout(timer.current);
      }
      videoRef.current.srcObject = null;
    };
  }, []);

  // clock
  useEffect(() => {
    if (isRecording) {
      setStatusString(`录制中: 剩余00:00:0${timeRemaining}`);
      if (timeRemaining > 0) {
        timer.current = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      } else {
        setIsRecording(false);
        recorderRef.current.stop();
      }
    }
  }, [timeRemaining]);
  return (
    <div className={styles.verificationPage}>
      <div className={styles.videoContainer}>
        <video width={600} height={400} ref={videoRef} autoPlay muted />
      </div>
      <div>
        <h3>
          请正面平视摄像头，保证光线充足，请勿遮挡面部
        </h3>
        <h4>
          {`当前状态: ${statusString}`}
        </h4>
      </div>
      <Button
        disabled={!canRecord}
        onClick={() => {
          if (recorderRef.current) {
            setIsRecording(true);
            setTimeRemaining(5);
            videoChunk.current = [];
            recorderRef.current.start();
          }
        }}
      >
        开始录制
      </Button>
    </div>
  );
}
export default FacialRecognition;
