package com.lakshan.service;

import com.lakshan.entity.UserProfile;
import com.lakshan.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Autowired
    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public void addUserProfile(UserProfile userProfile) {
        userProfileRepository.save(userProfile);
    }

    public UserProfile getUserProfileByUserId(int userId) {
       return userProfileRepository.findByUserId(userId).orElseThrow(() ->
               new IllegalArgumentException("UserProfile not found for user with id: " + userId)
       );
    }
    public void updateUserProfile(UserProfile userProfile) {
        if (userProfileRepository.existsById(userProfile.getId()))
            userProfileRepository.save(userProfile);
        else
            throw new IllegalArgumentException("UserProfile not found with id: " + userProfile.getId());
    }
}
