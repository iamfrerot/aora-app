import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";
const Bookmark = () => {
 const { query } = useLocalSearchParams();
 const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

 useEffect(() => {}, [query]);

 return (
  <SafeAreaView className='bg-primary h-full'>
   <FlatList
    data={posts}
    keyExtractor={(item) => item.$id}
    renderItem={({ item }) => <VideoCard video={item} />}
    ListHeaderComponent={() => (
     <View className='my-6 px-4 '>
      <Text className='font-pmedium text-2xl text-white'>Saved Vidoes</Text>
      <View className='mt-6 mb-8'>
       <SearchInput
        initialQuery={query}
        placeholder='Search your saved videos'
       />
      </View>
     </View>
    )}
    ListEmptyComponent={() => (
     <EmptyState
      title='No Videos Found'
      subtitle='No videos found for this search'
     />
    )}
   />
  </SafeAreaView>
 );
};

export default Bookmark;
