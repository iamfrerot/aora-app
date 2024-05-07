import { Client, Account, ID, Avatars, Databases, Query, Storage } from "react-native-appwrite";
export const Config = {
 endpoint: "https://cloud.appwrite.io/v1",
 platform: "com.frerot.aora",
 projectId: "6636155e002f50398868",
 databaseId: "663618560038f3479209",
 userCollectionId: '6636187900051b0727b1',
 videosCollectionId: '663618a5003e2f418ebe',
 storageId: "66361a17000677d6147d"
};
// Init your react-native SDK
const client = new Client();

client
 .setEndpoint(Config.endpoint) // Your Appwrite Endpoint
 .setProject(Config.projectId) // Your project ID
 .setPlatform(Config.platform) // Your application ID or bundle ID.
 ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
export const createUser = async (email, password, username) => {
 try {
  const newAccount = await account.create(ID.unique(),
   email,
   password, username
  );
  if (!newAccount) throw Error;
  const avatarUrl = avatars.getInitials(username);

  await signIn(email, password);
  const newUser = await databases.createDocument(
   Config.databaseId,
   Config.userCollectionId,
   ID.unique()
   ,
   {
    accountId: newAccount.$id,
    email,
    username, avatar: avatarUrl
   }
  );
  return newUser;
 } catch (error) {
  console.log(error);

  throw new Error(error);
 }

};

export const signIn = async (email, password) => {
 try {
  const session = await account.createEmailSession(email, password);
  return session;
 } catch (error) {
  throw new Error(error);
 }
};

export const getCurrerntUser = async () => {
 try {
  const currentAccount = await account.get();
  if (!currentAccount) throw Error;
  const currentUser = await databases.listDocuments(Config.databaseId, Config.userCollectionId, [Query.equal("accountId", currentAccount.$id)]);
  if (!currentUser) throw Error;
  return currentUser.documents[0];
 } catch (error) {

 }
};

export const getAllPosts = async () => {
 try {
  const posts = await databases.listDocuments(Config.databaseId, Config.videosCollectionId, [Query.orderDesc('$createdAt')]);
  return posts.documents;
 } catch (error) {
  throw new Error(error);
 }
};

export const getLatestPosts = async () => {
 try {
  const posts = await databases.listDocuments(Config.databaseId, Config.videosCollectionId
   , [Query.orderDesc('$createdAt', Query.limit(7))]
  );

  return posts.documents;
 } catch (error) {
  throw new Error(error);
 }
};

export const searchPosts = async (query) => {
 try {
  const posts = await databases.listDocuments(Config.databaseId, Config.videosCollectionId
   , [Query.search('title', query)]
  );

  return posts.documents;
 } catch (error) {
  throw new Error(error);
 }
};
export const getUserPosts = async (userId) => {
 try {
  const posts = await databases.listDocuments(Config.databaseId, Config.videosCollectionId
   , [Query.equal('creator', userId), Query.orderDesc("$createdAt")]
  );

  return posts.documents;
 } catch (error) {
  throw new Error(error);
 }
};

export const signOut = async () => {
 try {
  const session = await account.deleteSession('current');
 } catch (error) {
  throw new Error(error);
 }
};
export const getFilePreview = async (fileId, type) => {
 let fileUrl;
 try {
  if (type === "video") {
   fileUrl = storage.getFileView(Config.storageId, fileId);
  } else if (type === "image") {
   fileUrl = storage.getFilePreview(Config.storageId, fileId, 2000, 2000, "top", 100);

  } else {
   new Error("Invalid File type");
  }

  if (!fileUrl) throw Error;
  return fileUrl;
 } catch (error) {
  throw new Error(error);
 }

};
export const uploadFile = async (file, type) => {
 if (!file) return;

 const asset = {
  name: file.fileName,
  type: file.mimeType,
  size: file.fileSize,
  uri: file.uri
 };
 try {
  const uploadedFile = await storage.createFile(
   Config.storageId, ID.unique(), asset
  );
  const fileUrl = await getFilePreview(uploadedFile.$id, type);
  return fileUrl;
 } catch (error) {
  throw new Error(error);
 }
};
export const createVideo = async (form) => {
 try {
  const [thumbnailUrl, videoUrl] = await Promise.all([
   uploadFile(form.thumbnail, "image"),
   uploadFile(form.video, 'video')
  ]);
  const newPost = await databases.createDocument(Config.databaseId, Config.videosCollectionId, ID.unique(), {
   title: form.title,
   thumbnail: thumbnailUrl,
   video: videoUrl,
   prompt: form.prompt,
   creator: form.userId
  });
  return newPost;
 } catch (error) {
  throw new Error(error);
 }
};