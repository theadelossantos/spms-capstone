import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-item-analysis',
  templateUrl: './item-analysis.component.html',
  styleUrls: ['./item-analysis.component.css']
})
export class ItemAnalysisComponent implements AfterViewInit{
  deptId: number;
  gradeLevelId: number;
  sectionId: number;
  subjectId: number;
  assignmentId: number;
  subjectName: string;
  gradeLevelName: string;
  sectionName: string;
  quarters: any[]=[]
  selectedQuarter:number;
  correctResponses: number[] = []
  totalStudents: number
  meanValues: number[] = []
  formData: {
    hps_qa_total_score: number; 
  } = {
    hps_qa_total_score: 0, 
  };
  selectedItemNumber: number | null = null;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createDoughnutChart();
    }, 100);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.deptId = Number(params.get('deptId'));
      this.gradeLevelId = Number(params.get('gradelvlId'));
      this.sectionId = Number(params.get('sectionId'));
      this.subjectId = Number(params.get('subjectId'));
      this.assignmentId = Number(params.get('assignmentId'));
      
      console.log('Department:', this.deptId);
      console.log('Grade Level:', this.gradeLevelId);
      console.log('Section:', this.sectionId);
      console.log('Subject ID:', this.subjectId);
      console.log('Assignment ID:', this.assignmentId);

    });
    this.authService.getSubjectById(this.subjectId).subscribe(
      (subjectData: any) => {
        this.subjectName = subjectData.subjects[0].subject_name;
      },
      (error) => {
        console.error('Error fetching subject name:', error);
      }
    );
    this.authService.getGradeLevelById(this.gradeLevelId).subscribe(
      (gradeLevelData: any) => {
       this.gradeLevelName = gradeLevelData.gradelevelss[0].gradelvl;
      },
      (error) => {
        console.error('Error fetching grade level name:', error);
      }
    );
    this.authService.getSectionById(this.sectionId).subscribe(
      (sectionData: any) => {
        this.sectionName = sectionData.sections[0].section_name;
      },
      (error) => {
        console.error('Error fetching section name:', error);
      }
    );
    this.authService.getQuarters().subscribe((quartersData) => {
      this.quarters = quartersData;
      console.log('quarters', this.quarters);
      
        if (this.quarters && this.quarters.length > 0) {
        this.selectedQuarter = this.quarters[0].quarter_id;
        console.log('Selected Quarter ID:', this.selectedQuarter);
        this.fetchHps();
        }

      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    )

    this.authService.filterStudents(this.deptId, this.gradeLevelId, this.sectionId).subscribe(
      (studentsData: any) => {
        this.totalStudents = studentsData.students.length;
        console.log('students data', this.totalStudents)

      }
    )
  }

  onQuarterChange(){
    console.log('Selected Quarter ID:', this.selectedQuarter);

    if(this.selectedQuarter){
      this.fetchHps()
    }
    
  }

  fetchHps(){
    const filters = {
      gradelevel: this.gradeLevelId,
      section: this.sectionId,
      subject: this.subjectId,
      quarter: this.selectedQuarter
    };

    console.log(filters)
    this.authService.fetchHPSscores(filters).subscribe(
      (data) => {
        console.log(data)
        if (data && data.length > 0) {
          this.formData.hps_qa_total_score = parseFloat(data[0].hps_qa_total_score);
        } else {
          this.formData.hps_qa_total_score = 0;
        }
      }
    )
  }

  generateItemNumbers(): number[] {
    const hpsQaTotalScore = this.formData.hps_qa_total_score; 
    const itemNumbers: number[] = [];
  
    if (!isNaN(hpsQaTotalScore) && hpsQaTotalScore > 0) {
      for (let i = 1; i <= hpsQaTotalScore; i++) {
        itemNumbers.push(i);
      }
    }
  
    return itemNumbers;
  }
  handleInputClick(itemNumber: number) {
    this.selectedItemNumber = itemNumber;
  }


  calculatePercentage(correctResponses: number): number {
    if (this.totalStudents && correctResponses !== undefined) {
      return Math.round((correctResponses / this.totalStudents) * 100);
    }
    return 0;
  }
  

  calculateMean(correctResponses: number, totalStudents: number): number {
    if (totalStudents === 0) {
      return 0; 
    }
    return Math.round((correctResponses / totalStudents) * 100);
  }
  
  categorizePercentage(percentage: number): string {
    if (percentage >= 75) {
      return 'Mastered';
    } else if (percentage >= 50) {
      return 'Below Master';
    } else {
      return 'Not Mastered';
    }
  }
  

  
  createDoughnutChart() {
    const canvas: any = document.getElementById('donutChart');
    const ctx = canvas.getContext('2d');
  
    const masteredPercentage = this.calculateMean(
      this.correctResponses.reduce((a, b) => a + b, 0),
      this.totalStudents
    );
  
    const categories = ['Mastered', 'Below Master', 'Not Mastered'];
    const backgroundColors = ['green', 'blue', 'red'];
    const labels = categories.slice(); 
    const percentages = [masteredPercentage, 100 - masteredPercentage, 0];
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: percentages,
            backgroundColor: backgroundColors.concat('lightgray'), 
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '60%',
        animation: {
          animateRotate: true,
        },
      },
    });
  }

  buildItemAnalysisData(selectedItemNumber: number): any[] {
  const itemAnalysisData: any[] = [];
  
  const itemNumbers = this.generateItemNumbers();

  for (let i = 0; i < this.correctResponses.length; i++) {
    const correctResponses = this.correctResponses[i];
    const percentageCorrect = this.calculatePercentage(correctResponses);
    const itemNumber = itemNumbers[i];

    const itemData = {
      gradelvl_id: this.gradeLevelId,
      section_id: this.sectionId,
      subject_id: this.subjectId,
      correct_responses: correctResponses, 
      percentage_correct: percentageCorrect, 
      item_number: itemNumber,
    };

    itemAnalysisData.push(itemData);
  }

  return itemAnalysisData;
}

saveItemAnalysisData() {
  const selectedItemNumber: number = this.selectedItemNumber;
  const itemAnalysisData = this.buildItemAnalysisData(selectedItemNumber);

  console.log('correct responses', itemAnalysisData);

  for (const itemData of itemAnalysisData) {
    this.authService.addItemAnalysis(itemData).subscribe(
      (response) => {
        console.log('ItemAnalysis data added:', response);
      },
      (error) => {
        console.error('Error adding ItemAnalysis data:', error);
      }
    );
  }
}

  
  
}
