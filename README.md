# step-gfx-player

Preview player for playing .mp4 videofile with timestamps from .xml file

The video and .xml file is created from an after effects project

<img src="./docs/screenshot.png">


## Releases:
Precompiled windows release are here:
[link to latest release](https://github.com/olzzon/step-gfx-player/releases/latest)

## .xml file:
The filename of the .xml file must be the same as the .mp4 file, but with .xml extension

The format should be like this:
```
<xml>
    <general>
        <version>1</version>
        <credit>© TV 2 Grafik, 2023 Version: 3.7.3 - Written: 18/9/2023 @ 13:24:41</credit>
    </general>
    <comp name='Comp Markers'>
	<marker>
            <comment value='1. Comp marker'/>
            <time value='0'/>
            <duration value='0'/>
            <cuePointName value=''/>
            <eventCuePoint value='true'/>
            <chapter value=''/>
            <frameTarget value=''/>
            <url value=''/>
            <params/>
        </marker>
    <marker>
            <comment value='2. Comp marker'/>
            <time value='1'/>
            <duration value='0'/>
            <cuePointName value=''/>
            <eventCuePoint value='true'/>
            <chapter value=''/>
            <frameTarget value=''/>
            <url value=''/>
            <params/>
        </marker>
        <marker>
            <comment value='3. Comp marker'/>
            <time value='2'/>
            <duration value='0'/>
            <cuePointName value=''/>
            <eventCuePoint value='true'/>
            <chapter value=''/>
            <frameTarget value=''/>
            <url value=''/>
            <params/>
        </marker>
        <marker>
            <comment value='4. Comp marker'/>
            <time value='7'/>
            <duration value='0'/>
            <cuePointName value=''/>
            <eventCuePoint value='true'/>
            <chapter value=''/>
            <frameTarget value=''/>
            <url value=''/>
            <params/>
        </marker>
    </comp>
</xml>

```

## Build and run:
Development running a dev-server:
```
yarn start
```

Build for production:

(Made as basic as possible so it only builds for host machine environment, e.g for a build for Windows, you need to build it on windows)
```
yarn make
```
