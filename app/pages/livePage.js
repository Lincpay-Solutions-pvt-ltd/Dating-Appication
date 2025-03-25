import React from 'react';
import ZegoUIKitPrebuiltLiveStreaming, { HOST_DEFAULT_CONFIG, AUDIENCE_DEFAULT_CONFIG} 
    from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn'

export default function LivePage() {
  randomUserID = String(Math.floor(Math.random() * 100000))
  isHost = true;
  return (
      <View style={{flex: 1}}>
          <ZegoUIKitPrebuiltLiveStreaming
            appID={1849398951} // Your App ID
            appSign='358066ea3e7eda9a23556b421730092540a4893cceb0960faadadb9f928d742a'
            userID={randomUserID}
            userName={'user_'+randomUserID}
            liveID='testLiveID'

            config={{
                ...(isHost==true?HOST_DEFAULT_CONFIG:AUDIENCE_DEFAULT_CONFIG),
                onLeaveLiveStreaming: () => { props.navigation.navigate('HomePage') }
            }}
      />
    </View>
  )
}