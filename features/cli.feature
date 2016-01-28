Feature:
  As a user I want to be able to set rules for how the files
  in a directory should be named and where they should go in
  subdirectories so that I can see if my directory structure
  has broken any of my rules.

  Background:
        Given there is a directory
          And there is a configuration

  Scenario: I can check if the files in a directory fail to follow a pattern
      Given I have set a file name pattern like fail in my configuration
        And the files one,two,three are in the directory
       When I run the program
       Then I should see 3 errors

  Scenario: I can check if the files in a directory follow a pattern
      Given I have set a file name pattern like fail in my configuration
        And the file fail is in the directory
       When I run the program
       Then I should see 0 errors

  Scenario: I can check if all required files are present in a directory
      Given I have set a list of required file names like one,two,three
        And the files one,two,three are in the directory
       When I run the program
       Then I should see 0 errors

  Scenario: I can check if required files are missing in a directory
      Given I have set a list of required file names like one,two,three
        And there are 0 files in the directory
       When I run the program
       Then I should see 3 errors

  Scenario: I can check that all subdirectories in a directory follow a shared configuration
      Given that I have configured that all directories should have a shared configuration
        And in my shared configuration I have set a file name pattern like foo
        And in my shared configuration I have set a list of required file names like foo,foobar
        And there are 2 subdirectories
        And the subdirectories all have the files foo,foobar
       When I run the program
       Then I should see 0 errors

  Scenario: I can check if any subdirectory in a directory with a shared configuration break the provided rules
      Given that I have configured that all directories should have a shared configuration
        And in my shared configuration I have set a file name pattern like fail
        And there are 2 subdirectories
        And the subdirectories all have the file foo
       When I run the program
       Then I should see 2 errors

  Scenario: I can check if a specific subdirectory has the required files
      Given that I have configured that directory foo should have the files one,two,three
        And there is a directory named foo
        And foo has the files one,two,three
       When I run the program
       Then I should see 0 errors

  Scenario: I can check if a specific subdirectory has files following a pattern
      Given that I have configured that directory foo should only have files with names containing the word foo
        And there is a directory named foo
        And foo has the files foo,foobar,foobarbaz
       When I run the program
       Then I should see 0 errors

  Scenario: I can check if a specific subdirectory has files violating my configured rules
      Given that I have configured that directory foo should only have files with names containing the word foo
        And there is a directory named foo
        And foo has the file fail
       When I run the program
       Then I should see 1 error
