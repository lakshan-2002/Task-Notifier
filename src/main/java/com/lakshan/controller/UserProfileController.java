package com.lakshan.controller;

import com.lakshan.entity.UserProfile;
import com.lakshan.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user_profile")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public ResponseEntity<UserProfile> addUserProfile(@RequestBody UserProfile userProfile) {
        userProfileService.addUserProfile(userProfile);
        return ResponseEntity.status(201).body(userProfile);
    }

    @GetMapping("/{userId}")
    public UserProfile getUserProfileByUserId(@PathVariable int userId) {
        return userProfileService.getUserProfileByUserId(userId);
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateUserProfile(@RequestBody UserProfile userProfile) {
        userProfileService.updateUserProfile(userProfile);
        return ResponseEntity.ok(userProfile);
    }
}
