import React, { useState, useEffect, useRef } from 'react';
import { useTransaction, useAccount, useContract, useProvider, useSigner } from 'wagmi'
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../../../store/actions';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';

import useLensHub from '../../../../lib/wagmi/hooks/useLensHub';
import useMockProfile from '../../../../lib/wagmi/hooks/useMockProfile';

import {
    Button,
    ButtonGroup,
    Container,
    Grid,
    GridItem,
    Flex,
    Box,
    Text,
    Heading,
    useColorModeValue,
    chakra
  } from '@chakra-ui/react';
import Loader from '../../../Loader/Loader';

import Profile from '../Profile/Profile';
import { useIpfs } from '@onichandame/react-ipfs-hook'


const CreateProfile = () => {
    const [{ data: accountData, error: accountError, loading: accountLoading }] = useAccount({
        fetchEns: true,
      })
      const dispatch = useDispatch()
      const state = useSelector(state => state)

      const provider = useProvider()
      const signer = useSigner()
      const { createProfile } = useMockProfile();

      useEffect(() => {
        console.log(signer[0].data)
      }, [signer])

      const { ipfs, error } = useIpfs()
      
      useEffect(() => {
        // if (ipfs && ipfs.id) ipfs.id().then(val => setId(val.id))
        console.log(ipfs)
      }, [ipfs])

      const [ followNFTURICID, setFollowNFTURICID ] = useState("")


      const createFollowNFTURI = async () => {
      // create the metadata object we'll be storing
        const uriData = {
          "description": "Test Profile", 
          "external_url": "https://minthunt.io", 
          "image": "ipfs://bafkreia3rtwd6rsddu5igu7no3oaxdz5i3rknvnmiz5zr5j7dt5atv5sry", 
          "name": "TestProfile44",
          "attributes": [], 
        }
        const jsonObj = JSON.stringify(uriData);

        if(ipfs) {
         const res = await ipfs.add(jsonObj)
         setFollowNFTURICID(res.path)
        return res.path;
        }
      }

      useEffect(() => {
        console.log(followNFTURICID)
        createProfile({ to: accountData?.address, handle: "dd", imageURI: "ipfs://bafkreia3rtwd6rsddu5igu7no3oaxdz5i3rknvnmiz5zr5j7dt5atv5sry", followModule: "0x0000000000000000000000000000000000000000", followModuleData: "0x0000000000000000000000000000000000000000", followNFTURI: `ipfs://${followNFTURICID}` })
      }, [followNFTURICID])

    return(
      <Box
      mx="auto"
      px={8}
      py={4}
      rounded="lg"
      shadow="lg"
      bg={useColorModeValue("white", "gray.800")}
      maxW="2xl"
    >
     <chakra.span style={{marginBottom: "10px"}} display="block"><h2>New profile?</h2></chakra.span>
      <Button onClick={async () => {
        await createFollowNFTURI();
      }}>Create Profile</Button>
     </Box>
    )
}

// address to;
// string handle;
// string imageURI;
// address followModule;
// bytes followModuleData;
// string followNFTURI;


export default CreateProfile;

