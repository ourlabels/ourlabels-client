<p>
   <img src="screenshots/screenshot-mouse.png" alt="Mice being labeled" style="max-width: 600px; min-width: 400px;"/>
</p>

# Ourlabels - Web Based Community Annotation
A React.js website which can be used for annotating datasets (currently only rectangular annotations, but polygons to come)

All annotations are stored on a replicated, mongo database. A great resource for mongo databases is [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Raw annotation units are fractions proportionate to the image at whatever resolution is displayed (zoomed or not).

# Annotation container
  * Image component
    * A reusable component, but still needs a lot of work to truly be reusable
    * Uses react-konva to allow users to draw on an image and get sub-pixel specificity for coordinates
  * Classification component
    * Controls classification selection
    * Controls zoom level
    * Controls label types

# Projects
  * A user with administrator role can create a project
  * Projects can be of a predefined project type (currently: science, science video, civic, civic video)
  * Projects may be public (open to anyone with an account) or private (open to users who have been approved by the project owner).
  * Projects have
    * Labels (owners add these definitions for annotations - see labels)
    * Videos (Sequences of images) if a video type project
    * Images if a regular project
    * Owners
  * Data from projects can be downloaded by:
    * Owners if a private project
    * Anyone if a public project
# Videos
  * Video projects are special and backend operators must have ffmpeg with the ability to process the types of videos that are accepted.
  * Videos are limited to 15 MB and are split into individual frames (no matter what framerate the video is).
  * Default accepted video types are: MPEG2, MPEG4, TS
  * Annotation of video files is simplified by the presence of the Copy button on the Classification component. The Copy button allows a user to copy the previous frame's annotations, which the user can then alter for the current frame and save. It greatly reduces the cost of annotating.
# Labels 
  * Labels for a project are determined by the project owner. Labels consist of a color, a label, and a description. 
  * Labels are displayed on the Classification component when annotating an image/frame.
# Data
  * Annotation data can be downloaded in two formats,
    * COCO JSON format
      * Occluded, Truncated, Difficult attributes are not retained.
    * PASCAL VOC XML format
      * Occluded, Truncated, Difficult attributes are retained.