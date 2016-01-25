Feature:
  As a user I want to be able to set rules for how the files
  in a directory should be named and where they should go in
  subdirectories so that I can see if my directory structure
  has broken any of my rules.

  Background:
        Given There is a directory
          And There is a configuration

  Scenario: I can check if the files in a directory fail to follow a pattern
      Given I have set a file name pattern like fail in my configuration
        And The files one,two,three are in the directory
       When I run the program
       Then I should see 3 errors

  Scenario: I can check if the files in a directory follow a pattern
      Given I have set a file name pattern like fail in my configuration
        And The file fail is in the directory
       When I run the program
       Then I should see 0 errors

  Scenario: I can check if all required files are present in a directory
      Given I have set a list of required file names like one,two,three
        And The files one,two,three are in the directory
       When I run the program
       Then I should see 0 errors

  Scenario: I can check if required files are missing in a directory
      Given I have set a list of required file names like one,two,three
        And There are 0 files in the directory
       When I run the program
       Then I should see 3 errors

  Scenario: I can check that all subdirectories in a directory have the required files
      Given that I have configured that all directories should have the files one,two,three
        And there is 1 subdirectory
        And the subdirectories all have the files one,two,three
       When I run the program
       Then I should see 0 errors

  Scenario: I can check if any subdirectories in a directory are missing required files
      Given that I have configured that all directories should have the files one,two,three
        And there is 1 subdirectory
        And 1 subdirectory has no files
       When I run the program
       Then I should see 1 errors

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

    @test
  Scenario: I can check if a specific subdirectory has files violating my configured rules
      Given that I have configured that directory foo should only have files with names containing the word foo
        And there is a directory named foo
        And foo has the file fail
       When I run the program
       Then I should see 1 error
