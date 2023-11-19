import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native'
import React, { cloneElement, useEffect, useState } from 'react'
import { collection, addDoc, doc, getDocs, deleteDoc, updateDoc, query,where, documentId } from 'firebase/firestore';
import { db } from './config';
import { async } from '@firebase/util';
const FireStore = () => {
    const [data, setData] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('')
    const [age, setAge] = useState(0)
    const [mail, setMail] = useState('')
    const [nameInput, setNameInput] = useState('')
    const [ageInput, setAgeInput] = useState(0)
    const [mailInput, setMailInput] = useState('')
    const [id, setId] = useState('')
    const handleAccount = async () => {
        console.log(age)
        const res = await addDoc(collection(db, 'users'), {
            name: name,
            age: age,
            mail: mail
        })
        getData()
    }
    const update = async (id) => {
        await updateDoc(doc(db, 'users', id), {
            name: name,
            age: age,
            mail: mail
        })
        getData()
    }
    const getDataId = async (id) => {
        setId(id)
        const q = query(collection(db, "users"), where(documentId(), "==", id));
        await  getDocs(q).then((data) => {
            setName(data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].name)
            setAge(data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].age)
            setMail(data.docs.map((doc) => ({...doc.data(), id: doc.id}))[0].mail)
          })
    }
    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        await getDocs(collection(db, 'users')).then((doc) => {
            setData(doc.docs.map((docs) => ({ ...docs.data(), id: docs.id })))
        })
    }
    const deleteData = async (id) => {
        await deleteDoc(doc(db, "users", id));
        getData()
    }
    return (
        <View>
            <View style={styles.Username}>
                <TextInput
                    placeholder='Enter your name'
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.username_input}
                />
            </View>
            {/* 20521850 */}
            <View style={styles.Username}>

                <TextInput
                    placeholder='Enter your age'
                    value={age}
                    onChangeText={(text) => setAge(text)}
                    style={styles.username_input}
                // secureTextEntry={true}
                />
            </View>
            <View style={styles.Username}>

                <TextInput
                    placeholder='Enter email'
                    value={mail}
                    onChangeText={(text) => setMail(text)}
                    style={styles.username_input}
                />
            </View>

            <View style={styles.Login}>
                <TouchableOpacity
                    onPress={() => (handleAccount())}
                >
                    {/* 20521850 */}
                    <Text style={styles.Login_text}>Submit</Text>
                </TouchableOpacity>
            </View>
            {data.map((users) => (
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {console.log(users)}
                    <View>
                        <Text>Name: {users.name}</Text>
                        <Text>Age: {users.age}</Text>
                        <Text>Mail: {users.mail}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{height:30, width:60, borderWidth:1, alignItems:'center', margin:5}} onPress={() => (setModalVisible(!modalVisible), getDataId(users.id))}>
                            <Text>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{height:30, width:60, borderWidth:1, alignItems:'center', margin:5}} onPress={() => deleteData(users.id)} >
                            <Text>Delete</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Cập nhật</Text>
                        <View style={styles.Username}>

                            <TextInput
                                placeholder='Enter your name'
                                value={name}
                                onChangeText={(text) => setName(text)}
                                style={styles.username_input}
                            />
                        </View>
                        <View style={styles.Username}>
                            <TextInput
                                placeholder='Enter your name'
                                value={age}
                                onChangeText={(text) => setAge(text)}
                                style={styles.username_input}
                            />
                        </View>
                        <View style={styles.Username}>
                            <TextInput
                                placeholder='Enter your name'
                                value={mail}
                                onChangeText={(text) => setMail(text)}
                                style={styles.username_input}
                            />
                        </View>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => (setModalVisible(!modalVisible),update(id))}>
                            <Text style={styles.textStyle}>Xác nhận</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Logo: {
        height: 100,
        width: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50
    },
    LogoImage: {
        height: 100,
        width: 100,
        borderRadius: 100
    },
    Username: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 300,
        borderWidth: 1,
        margin: 10,
        height: 50,
        // 205218520
        borderRadius: 5
    },
    username_input: {
        width: 250,
        height: 30,
    },
    fogotpass: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 300,
        margin: 5,
        height: 10,
    },
    fogotpass_text: {
        color: '#fc03b6',
        height: 20
    },
    Login: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        borderWidth: 1,
        margin: 5,
        height: 50,
        borderRadius: 5,
        backgroundColor: '#ed6415'
        // 20521850
    },
    welcome: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: 'bold'
    },
    Login_text: {
        color: 'white',
        fontWeight: 'bold'
    },
    orlogin: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    orlogin_text: {
        fontWeight: 'bold'
    },
    orlogin_with: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100
    },
    // 20521850
    login_fb: {
        height: 50,
        width: 50,
        borderRadius: 100,
        margin: 5
    },
    haveaccount: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        margin: 5,
        height: 20,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})
export default FireStore