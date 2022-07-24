package it.unisa.KryptoAuth.service;

import it.unisa.KryptoAuth.contracts.Authentication;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

@Service
public class BlockchainServiceImpl implements BlockchainService {

    private final static Web3j web3j = Web3j.build(new HttpService("HTTP://127.0.0.1:7545"));
    private final static String CONTRACT_ADDRESS = "0x1449bB334D8E4E2299F1Af625ee37d0cDF0F8b1A";
    private static String privateKey;
    private static Authentication authentication = null;

    @Override
    public Authentication deploy(String privateKey) throws Exception{
        Credentials credentials = Credentials.create(privateKey);
        return Authentication.deploy(web3j, credentials, new DefaultGasProvider()).send();
    }

    @Override
    public Authentication loadContract(String privateKey) {
        BlockchainServiceImpl.privateKey = privateKey;
        Credentials credentials = Credentials.create(BlockchainServiceImpl.privateKey);
        authentication = Authentication.load(CONTRACT_ADDRESS, web3j, credentials, new DefaultGasProvider());
        return authentication;
    }

    @Override
    public boolean isAdmin(String address) throws Exception {
        return loadContract(privateKey).isAdmin(address).send();
    }

    @Override
    public boolean isUser(String address) throws Exception {
        return loadContract(privateKey).isAdmin(address).send();
    }

    @Override
    public boolean registerUser(String address, String name, String password) throws Exception {
        return loadContract(privateKey).registerUser(address, name, password).send().isStatusOK();
    }

    @Override
    public boolean registerAdmin(String address, String name, String password) throws Exception {
        return loadContract(privateKey).registerAdmin(address, name, password).send().isStatusOK();
    }

    @Override
    public boolean loginUser(String address, String name, String password) throws Exception {
        return loadContract(privateKey).loginUser(address, name, password).send().isStatusOK();
    }

    @Override
    public boolean loginAdmin(String address, String name, String password) throws Exception {
        return loadContract(privateKey).loginAdmin(address, name, password).send().isStatusOK();
    }

    @Override
    public boolean isUserLogged(String address) throws Exception {
        return loadContract(privateKey).checkIsUserLogged(address).send();
    }

    @Override
    public boolean isAdminLogged(String address) throws Exception {
        return loadContract(privateKey).checkIsAdminLogged(address).send();
    }

    @Override
    public void logoutUser(String address) throws Exception {
        loadContract(privateKey).logoutUser(address).send();
    }

    @Override
    public void logoutAdmin(String address) throws Exception {
        loadContract(privateKey).logoutAdmin(address).send();
    }

    @Override
    public void addUser(String address) throws Exception {
        loadContract(privateKey).addUser(address).send();
    }

    @Override
    public void addAdmin(String address) throws Exception {
        loadContract(privateKey).addAdmin(address).send();
    }

    @Override
    public void removeUser(String address) throws Exception {
        loadContract(privateKey).removeUser(address).send();
    }

    @Override
    public boolean isContractLoaded(String address) throws Exception {
        return authentication != null && authentication.getAddress().send().compareTo(address) == 0;
    }
}