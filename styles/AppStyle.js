import { Dimensions, StyleSheet } from 'react-native';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const appStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:15,
        padding: 12.5,
        alignItems: 'center',
        alignSelf:'stretch',
    },

    row: {
        margin:2,
        paddingBottom:0,
        flexDirection: 'row',
        alignSelf:'stretch',
    },
    rowLeft: {
        flexDirection:'row',
        alignSelf: 'flex-start'
    },
    rowRight: {
        alignSelf:'stretch',
        alignItems:'flex-end',
        flex:1,
    },

    cardContainer: {
        flex:1,
        alignSelf:'stretch',
        marginRight:-7.5,
    },

    card: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'stretch',
        
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 10,
        shadowRadius: 20.41,
        borderBottomWidth: 3,
        borderBottomColor: "#a8a8a8",
        elevation: 4,

        paddingTop:10,
        paddingBottom:10,
        marginBottom:5,
    }, 
    
    modal: {
        alignSelf:'stretch',
        
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 10,
        shadowRadius: 20.41,
        borderWidth: 3,
        borderBottomLeftRadius:0,
        borderBottomRightRadius:0,
        borderBottomWidth:0,
        borderColor: "#a8a8a8",
        elevation: 4,
        backgroundColor:'#fcfcfc',
        paddingTop:10,
        width:width-10,
        marginLeft:5,
        opacity:1,
        zIndex:5
    },

    popup: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'stretch',
        
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 10,
        shadowRadius: 20.41,
        borderWidth: 3,
        borderColor: "#a8a8a8",
        elevation: 4,
        backgroundColor:'#fcfcfc',
        left:width*0.05,
        top:height*0.25,
        paddingTop:10,
        paddingBottom:10,
        width:width*0.9,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1,
    },

    modalOverlay: {
        alignSelf:'stretch',
        top:0,
        width:width,
        height:height,
        backgroundColor:'#a8a8a8',
        opacity:0.45,
        zIndex:-1,
    },
    

    loadingHolder: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'stretch',
        width:width,
        height:height,
        top:0,
        bottom:0,
        borderRadius: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 10,
        shadowRadius: 20.41,
        elevation: 4,
        zIndex:-5,
        opacity:0.9,
    },
    loadingHolderNoColor: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'stretch',
        width:width,
        height:height,
        top:0,
        bottom:0,
        borderRadius: 0,
        zIndex:-1,
    },
    loadingElement: {
        zIndex:-5,
    },
    
    scrollView: {
      marginHorizontal: 0,
      paddingRight: 10,
    },

    regularButton: {
        backgroundColor: '#fafafa',
        marginTop:10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'stretch',
        height: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 20,
            height: 5,
        },
        shadowOpacity: 0.9,
        shadowRadius: 2.62,
        borderWidth:1.4,
        borderColor:'#cccccc',
        elevation: 6
    },

    formInput: {
        borderRadius: 25,
        backgroundColor: '#f5f5f5',
        borderColor: '#8A8F9E',
        borderWidth: 1,
        
        height: 40,
        flex: 1,
        height: 40,
        fontSize: 15,
        paddingLeft: 15,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'stretch',
    },

    formInputClear: {
        height: 40,
        flex: 1,
        height: 40,
        fontSize: 15,
        paddingLeft: 15,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'stretch',
    },

    formInputContainer: {
        borderRadius: 25,
        backgroundColor: '#f5f5f5',
        borderColor: '#8A8F9E',
        borderWidth: 1,
        flex: 1,

        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'stretch',
    },
    lineSeperator: {
        flex:1,
        backgroundColor:'#333333',
        height:2,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'stretch',
        
    },
    lineSeperatorFull: {
        flex:1,
        marginHorizontal:-10,
        backgroundColor:'#333333',
        height:2,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'stretch',
        
    },
 });

 export default appStyle;