# Songify

No-backend needed at all. All the projects is running with firebase.

The projects does authentication with firebase and stores profile metadata on firestore. The uploads of music/audio files goes to firebase storage. Everything hosted on firebase hosting.

There are sign-in and sign-up pages handling fireauth and global state profile info; Then a homepage that lists every playlist and music made by the user handled with firestore; The header have a few links to the music uploads page, that the user can upload music files in the app with firebase storage, and the playlist creation page, that let the users create new playlists with the already uploaded musics.
